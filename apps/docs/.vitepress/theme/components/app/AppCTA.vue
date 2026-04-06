<script setup lang="ts">
import { ref, computed } from 'vue';
import { kebabCase } from 'change-case';
import Prando from 'prando';
import { Play, ArrowRight, Star, BarChart3 } from '@lucide/vue';
import { siGithub } from 'simple-icons';
import { UiAvatar, UiButton, UiBadge, UiHeadline, UiDescription, UiContainer, UiSection, UiIcon } from '../ui';
import { useVisibility } from '../../composables/useVisibility';
import { useAvatarStyleList } from '../../composables/avatar';
import { useApiStats } from '../../composables/useApiStats';
import { formatNumber } from '../../utils/format';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { once: false, threshold: 0.1 });

const avatarStyleList = useAvatarStyleList();
const apiStats = useApiStats();

const requestsLabel = computed(() => {
  if (!apiStats.value) return null;
  return `${formatNumber(apiStats.value.monthlyRequests)} requests in ${apiStats.value.monthLabel}`;
});

const bgAvatars = computed(() => {
  const prng = new Prando(321);
  const avatars = [];
  const seeds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

  for (let i = 0; i < 16; i++) {
    const style = kebabCase(avatarStyleList.value[i % avatarStyleList.value.length]);
    const angle = (i / 16) * Math.PI * 2 + prng.next() * 0.3;
    const radius = 25 + prng.next() * 22;
    avatars.push({
      style,
      seed: seeds[i],
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      size: 40 + prng.next() * 28,
      rotation: prng.next() * 30 - 15,
      delay: prng.next() * 2,
    });
  }

  return avatars;
});
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider center>
    <template #background>
      <div class="app-cta-gradient"></div>
      <div
        v-for="(avatar, index) in bgAvatars"
        :key="index"
        class="app-cta-bg-avatar"
        :style="{
          left: `${avatar.x}%`,
          top: `${avatar.y}%`,
          width: `${avatar.size}px`,
          height: `${avatar.size}px`,
          transform: `rotate(${avatar.rotation}deg)`,
          animationDelay: `${avatar.delay}s`,
        }"
      >
        <UiAvatar :style-name="avatar.style" :style-options="{ seed: avatar.seed, size: 80 }" :alt="avatar.style" />
      </div>
    </template>
    <UiContainer class="app-cta-container">
      <UiBadge variant="orange">Get Started Today</UiBadge>
      <UiHeadline>Ready to create <strong>amazing</strong> avatars?</UiHeadline>
      <UiDescription class="app-cta-description">
        Join thousands of developers using DiceBear. Create unique profile pictures — forever free.
      </UiDescription>

      <div class="app-cta-actions">
        <UiButton href="/playground/" class="app-cta-btn-primary">
          <Play :size="20" />
          Open Playground
        </UiButton>
        <UiButton href="/introduction/" variant="secondary">
          Read the Docs
          <ArrowRight />
        </UiButton>
      </div>

      <div class="app-cta-proof-links">
        <a
          href="https://github.com/dicebear/dicebear"
          target="_blank"
          rel="noopener"
          class="app-cta-proof-link"
        >
          <UiIcon :path="siGithub.path" :size="16" />
          <span>Star us on GitHub</span>
          <Star :size="14" class="app-cta-star-icon" />
        </a>

        <a
          v-if="requestsLabel"
          href="/stats/"
          class="app-cta-proof-link"
        >
          <BarChart3 :size="16" class="app-cta-stats-icon" />
          <span>{{ requestsLabel }}</span>
        </a>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-cta {
  &-gradient {
    background:
      radial-gradient(ellipse 60% 60% at 50% 50%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent),
      radial-gradient(ellipse 40% 40% at 30% 30%, color-mix(in srgb, var(--vp-c-purple-1) 5%, transparent), transparent),
      radial-gradient(ellipse 40% 40% at 70% 70%, color-mix(in srgb, var(--vp-c-green-1) 4%, transparent), transparent);
  }

  &-bg-avatar {
    position: absolute;
    border-radius: var(--vp-radius-sm);
    overflow: hidden;
    opacity: 0.06;
    animation: app-cta-float-gentle 8s ease-in-out infinite;
    animation-play-state: paused;
    transition: opacity var(--duration-mid) var(--ease-smooth);

    .visible & {
      animation-play-state: running;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-container {
    opacity: 0;
    transform: translateY(40px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-description {
    margin-bottom: 48px;
    max-width: 600px;
  }

  &-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 32px;
  }

  &-proof-links {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  &-proof-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 100px;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-elv);
    transition: color var(--duration-fast) var(--ease-smooth),
                border-color var(--duration-fast) var(--ease-smooth),
                box-shadow var(--duration-fast) var(--ease-smooth);

    &::after {
      display: none !important;
    }

    &:hover {
      color: var(--vp-c-text-1);
      border-color: var(--vp-c-border);
      box-shadow: var(--vp-shadow-1);

      .app-cta-star-icon {
        transform: scale(1.2) rotate(15deg);
      }

      .app-cta-stats-icon {
        color: var(--vp-c-brand-1);
      }
    }
  }

  &-star-icon {
    color: #f59e0b;
    fill: #f59e0b;
    transition: transform var(--duration-mid) var(--ease-spring);
  }

  &-stats-icon {
    color: var(--vp-c-brand-1);
    transition: color var(--duration-fast) var(--ease-smooth);
  }
}

@keyframes app-cta-float-gentle {
  0%, 100% {
    transform: translateY(0) rotate(var(--rotation, 0deg));
  }
  50% {
    transform: translateY(-12px) rotate(var(--rotation, 0deg));
  }
}

@media (max-width: 768px) {
  .app-cta {
    &-actions {
      flex-direction: column;
    }

    &-bg-avatar {
      display: none;
    }
  }
}
</style>
