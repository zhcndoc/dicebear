<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useData } from 'vitepress';

const props = defineProps<{
  rate: number;
}>();

const { isDark } = useData();
const containerRef = ref<HTMLDivElement>();
let globe: any = null;
let eventInterval: ReturnType<typeof setInterval>;
let resizeObserver: ResizeObserver | null = null;
let rotationFrame: number | null = null;

const apiBase = 'https://api.dicebear.com/9.x';
const avatarStyles = ['thumbs', 'shapes', 'lorelei', 'pixel-art', 'adventurer', 'bottts', 'avataaars', 'notionists'];

interface GlobeEvent {
  id: number;
  lat: number;
  lng: number;
  url: string;
}

let countriesGeoJson: any = null;

let events: GlobeEvent[] = [];
let eventId = 0;
const elementMap = new Map<number, HTMLElement>();
const pendingTimeouts: ReturnType<typeof setTimeout>[] = [];

const preloadedUrls: string[] = [];
const PRELOAD_BUFFER = 6;

function generateAvatarUrl() {
  const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
  const seed = Math.random().toString(36).slice(2, 8);
  return `${apiBase}/${style}/svg?seed=${seed}&size=64`;
}

function preloadAvatar(url: string) {
  const img = new Image();
  img.src = url;
}

function fillPreloadBuffer() {
  while (preloadedUrls.length < PRELOAD_BUFFER) {
    const url = generateAvatarUrl();
    preloadedUrls.push(url);
    preloadAvatar(url);
  }
}

function getPreloadedUrl(): string {
  if (preloadedUrls.length > 0) {
    const url = preloadedUrls.shift()!;
    const newUrl = generateAvatarUrl();
    preloadedUrls.push(newUrl);
    preloadAvatar(newUrl);
    return url;
  }
  return generateAvatarUrl();
}

// Pre-computed land points sampled from GeoJSON on first load
let landPoints: [number, number][] = [];

function buildLandPoints() {
  if (landPoints.length > 0 || !countriesGeoJson) return;
  for (const feature of countriesGeoJson.features) {
    const polygons = feature.geometry.type === 'MultiPolygon'
      ? feature.geometry.coordinates
      : [feature.geometry.coordinates];
    for (const poly of polygons) {
      const ring = poly[0]; // outer ring
      if (!ring || ring.length < 3) continue;
      // Compute bounding box
      let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
      // Sample points within the bounding box
      const area = (maxLng - minLng) * (maxLat - minLat);
      const samples = Math.max(2, Math.floor(area / 50));
      for (let i = 0; i < samples; i++) {
        const lng = minLng + Math.random() * (maxLng - minLng);
        const lat = minLat + Math.random() * (maxLat - minLat);
        if (pointInPolygon(lng, lat, ring)) {
          landPoints.push([lat, lng]);
        }
      }
    }
  }
  // Fallback if sampling yielded too few points
  if (landPoints.length < 20) {
    landPoints = [
      [48.86, 2.35], [40.71, -74.01], [35.68, 139.65], [51.51, -0.13],
      [-33.87, 151.21], [-23.55, -46.63], [37.76, -122.44], [1.35, 103.82],
      [52.52, 13.41], [28.61, 77.21], [39.90, 116.41], [-1.29, 36.82],
      [19.43, -99.13], [25.20, 55.27], [41.01, 28.98], [22.32, 114.17],
      [34.05, -118.24], [55.76, 37.62], [-34.60, -58.38], [59.33, 18.07],
    ];
  }
}

function pointInPolygon(x: number, y: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

const MIN_DISTANCE_DEG = 12;

function pickLandPoint(): [number, number] {
  // Try to find a point far enough from active events
  for (let attempt = 0; attempt < 30; attempt++) {
    const pt = landPoints[Math.floor(Math.random() * landPoints.length)];
    let tooClose = false;
    for (const e of events) {
      if (Math.abs(pt[0] - e.lat) < MIN_DISTANCE_DEG && Math.abs(pt[1] - e.lng) < MIN_DISTANCE_DEG) {
        tooClose = true;
        break;
      }
    }
    if (!tooClose) return pt;
  }
  // Fallback: pick any random land point with slight offset
  const base = landPoints[Math.floor(Math.random() * landPoints.length)];
  return [
    base[0] + (Math.random() - 0.5) * 10,
    base[1] + (Math.random() - 0.5) * 10,
  ];
}

function syncGlobe() {
  if (globe) globe.htmlElementsData([...events]);
}

function addEvent() {
  const city = pickLandPoint();
  const url = getPreloadedUrl();

  const ev: GlobeEvent = {
    id: eventId++,
    lat: city[0],
    lng: city[1],
    url,
  };
  events.push(ev);
  syncGlobe();

  const t1 = setTimeout(() => {
    const el = elementMap.get(ev.id);
    if (el) el.classList.add('app-stats-globe-bubble--leaving');

    const t2 = setTimeout(() => {
      events = events.filter(e => e !== ev);
      elementMap.delete(ev.id);
      syncGlobe();
    }, 600);
    pendingTimeouts.push(t2);
  }, 8000);
  pendingTimeouts.push(t1);
}

function createAvatarElement(d: any) {
  const outer = document.createElement('div');
  outer.className = 'app-stats-globe-marker';
  outer.dataset.lat = String(d.lat);
  outer.dataset.lng = String(d.lng);

  const inner = document.createElement('div');
  inner.className = 'app-stats-globe-bubble';
  inner.innerHTML = `
    <span class="app-stats-globe-bubble-ring"></span>
    <span class="app-stats-globe-bubble-disc">
      <img src="${d.url}" alt="" class="app-stats-globe-bubble-img" />
    </span>
  `;
  outer.appendChild(inner);
  elementMap.set(d.id, inner);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      inner.classList.add('app-stats-globe-bubble--visible');
    });
  });

  return outer;
}

// Three.js imports cached after first init
let threeModule: any = null;

async function initGlobe() {
  if (!containerRef.value) return;

  const { default: Globe } = await import('globe.gl');
  threeModule = await import('three');

  const container = containerRef.value;
  const width = container.clientWidth;
  const height = container.clientHeight;
  const dark = isDark.value;

  globe = new Globe(container, {
    rendererConfig: { antialias: true, alpha: true },
  })
    .width(width)
    .height(height)
    .backgroundColor('rgba(0,0,0,0)')
    .showAtmosphere(true)
    .atmosphereColor(dark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.1)')
    .atmosphereAltitude(0.14)
    .globeImageUrl(null as any)
    .htmlElementsData([...events])
    .htmlElement((d: any) => createAvatarElement(d))
    .htmlLat((d: any) => d.lat)
    .htmlLng((d: any) => d.lng)
    .htmlAltitude(0.015)
    .htmlTransitionDuration(0)
    .htmlElementVisibilityModifier((el: HTMLElement, isVisible: boolean) => {
      const inner = el.firstElementChild as HTMLElement;
      if (!inner) return;
      if (isVisible) {
        inner.classList.remove('app-stats-globe-bubble--hidden');
        // Scale based on angular distance to camera center
        const lat = Number(el.dataset.lat);
        const lng = Number(el.dataset.lng);
        const pov = globe.pointOfView();
        const toRad = Math.PI / 180;
        const dLat = (lat - pov.lat) * toRad;
        const dLng = (lng - pov.lng) * toRad;
        const a = Math.sin(dLat / 2) ** 2 +
          Math.cos(lat * toRad) * Math.cos(pov.lat * toRad) * Math.sin(dLng / 2) ** 2;
        const angDist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // 0 = center → scale 1.0, PI/2 = edge → scale 0.55
        const scale = 0.55 + 0.45 * Math.max(0, 1 - angDist / (Math.PI / 2));
        inner.style.setProperty('--bubble-scale', scale.toFixed(2));
      } else {
        inner.classList.add('app-stats-globe-bubble--hidden');
      }
    })
    .enablePointerInteraction(false);

  // Land polygons
  if (!countriesGeoJson) {
    try {
      const res = await fetch('/ne_110m_land.geojson');
      countriesGeoJson = await res.json();
    } catch { /* ignore */ }
  }

  buildLandPoints();

  if (countriesGeoJson) {
    globe
      .hexPolygonsData(countriesGeoJson.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.35)
      .hexPolygonUseDots(true)
      .hexPolygonColor(dark ? 'rgba(56, 189, 248, 0.65)' : 'rgba(2, 132, 199, 0.28)')
      .hexPolygonAltitude(0.006);
  }

  // Apply material + lights for current theme
  applyTheme();

  // Camera
  globe.pointOfView({ lat: 30, lng: 20, altitude: 1.8 });

  const controls = globe.controls();
  controls.autoRotate = false;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;

  // Custom tilted rotation to maximize visible landmass.
  // The latitude oscillates so when the view crosses the Pacific,
  // it tilts north (Russia/Alaska) or south (Australia/Indonesia).
  let rotLng = 20;
  const ROT_SPEED = 0.05;  // °/frame — full rotation ≈ 120 s at 60 fps
  const TILT = 15;         // latitude oscillation amplitude
  const BASE_LAT = 35;     // center latitude (Northern Hemisphere bias)
  const TILT_FREQ = 1.3;   // oscillations per rotation (non-integer avoids repetition)

  function animateRotation() {
    rotLng += ROT_SPEED;
    const lat = BASE_LAT + TILT * Math.sin(rotLng * TILT_FREQ * Math.PI / 180);
    globe.pointOfView({ lat, lng: rotLng % 360, altitude: 1.8 }, 0);
    rotationFrame = requestAnimationFrame(animateRotation);
  }
  rotationFrame = requestAnimationFrame(animateRotation);

  globe.renderer().domElement.style.cursor = 'default';

  const scene = globe.scene();
  if (scene) scene.background = null;

  resizeObserver = new ResizeObserver(() => {
    if (!globe || !containerRef.value) return;
    const w = containerRef.value.clientWidth;
    const h = containerRef.value.clientHeight;
    globe.width(w).height(h);
  });
  resizeObserver.observe(container);
}

function applyTheme() {
  if (!globe || !threeModule) return;
  const dark = isDark.value;
  const { MeshPhongMaterial, Color, AmbientLight, DirectionalLight } = threeModule;

  // Update atmosphere
  globe
    .atmosphereColor(dark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.1)');

  // Update hex polygon colors — pass string directly, no per-polygon closure needed
  globe
    .hexPolygonColor(dark ? 'rgba(56, 189, 248, 0.65)' : 'rgba(2, 132, 199, 0.28)');

  // Dispose old material before creating a new one to free GPU resources
  const oldMat = globe.globeMaterial();
  if (oldMat && typeof oldMat.dispose === 'function') oldMat.dispose();

  const globeMat = new MeshPhongMaterial({
    color: new Color(dark ? '#2a3050' : '#e4ecf6'),
    shininess: dark ? 20 : 25,
    specular: new Color(dark ? '#446688' : '#d0e0f0'),
    emissive: new Color(dark ? '#283248' : '#d4e2f0'),
    emissiveIntensity: dark ? 0.6 : 0.35,
    transparent: true,
    opacity: dark ? 0.88 : 0.95,
  });
  globe.globeMaterial(globeMat);

  // Dispose old lights before creating new ones
  const oldLights = globe.lights();
  if (oldLights) oldLights.forEach((l: any) => l.dispose?.());

  const ambient = new AmbientLight(dark ? 0xffffff : 0xf0f4fa, dark ? 1.6 : 1.4);
  const dir = new DirectionalLight(dark ? 0x6699cc : 0xf4f8ff, dark ? 1.0 : 0.5);
  dir.position.set(5, 3, 5);
  globe.lights([ambient, dir]);
}

onMounted(async () => {
  fillPreloadBuffer();
  await initGlobe();

  for (let i = 0; i < 8; i++) {
    pendingTimeouts.push(setTimeout(addEvent, i * 250));
  }
  eventInterval = setInterval(addEvent, 800);
});

watch(isDark, () => { applyTheme(); });

onUnmounted(() => {
  clearInterval(eventInterval);
  pendingTimeouts.forEach(clearTimeout);
  pendingTimeouts.length = 0;
  events = [];
  eventId = 0;
  elementMap.clear();
  preloadedUrls.length = 0;
  if (rotationFrame !== null) { cancelAnimationFrame(rotationFrame); rotationFrame = null; }
  if (globe) { globe._destructor(); globe = null; }
  if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }
});

const formattedRate = (r: number) => {
  if (r >= 1000) return `~${(r / 1000).toFixed(1)}k`;
  return `~${r.toFixed(0)}`;
};
</script>

<template>
  <div class="app-stats-globe">
    <div ref="containerRef" class="app-stats-globe-wrap">
      <div class="app-stats-globe-ring" />
    </div>
    <p class="app-stats-globe-caption">
      {{ formattedRate(props.rate) }} avatars generated every second — worldwide
    </p>
  </div>
</template>

<style lang="scss" scoped>
.app-stats-globe {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;

  &-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    pointer-events: none;
    overflow: hidden;

    :deep(canvas) {
      width: 100% !important;
      height: 100% !important;
    }
  }

  &-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 54.5%;
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1.5px solid rgba(2, 132, 199, 0.2);
    pointer-events: none;
    z-index: 1;

    .dark & {
      border-color: rgba(56, 189, 248, 0.3);
    }
  }

  &-caption {
    font-size: 13px;
    color: var(--vp-c-text-3);
    text-align: center;
    line-height: 1.4;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .app-stats-globe {
    &-wrap {
      max-width: 320px;
      margin-inline: auto;
    }
  }
}
</style>

<style lang="scss">
.app-stats-globe-bubble {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  &--visible {
    opacity: 1;
    transform: scale(var(--bubble-scale, 1));
  }

  &--hidden {
    opacity: 0 !important;
    transition: opacity 0.15s ease !important;
  }

  &--leaving {
    opacity: 0 !important;
    transform: scale(0.3) !important;
    transition: opacity 0.5s ease, transform 0.5s ease !important;
  }

  &-ring {
    position: absolute;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid var(--vp-c-brand-1);
    opacity: 0;
    animation: app-stats-globe-ping 1.4s cubic-bezier(0, 0, 0.2, 1) forwards;
  }

  &-disc {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid rgba(255, 255, 255, 0.95);
    box-shadow:
      0 2px 12px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(0, 0, 0, 0.04);
    overflow: hidden;
  }

  &-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: block;
  }
}

.dark .app-stats-globe-bubble-disc {
  background: #1a1c2a;
  border-color: rgba(56, 189, 248, 0.2);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(56, 189, 248, 0.1);
}

@keyframes app-stats-globe-ping {
  0% {
    opacity: 0.6;
    transform: scale(0.5);
  }
  100% {
    opacity: 0;
    transform: scale(2.2);
  }
}

@media (max-width: 768px) {
  .app-stats-globe-bubble {
    &-disc {
      width: 30px;
      height: 30px;
    }

    &-ring {
      width: 36px;
      height: 36px;
    }
  }
}
</style>
