<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ThemeOptions } from '@shared/types';
import { useData } from 'vitepress';
import { kebabCase } from 'change-case';
import { mdiAccount, mdiArrowRight, mdiChevronRight } from '@mdi/js';

const { theme } = useData<ThemeOptions>();

const seed = ref('');
const isTyping = ref(false);
let typingTimeout: ReturnType<typeof setTimeout>;

const selectedStyles = ['lorelei', 'avataaars', 'bottts', 'pixelArt', 'adventurer', 'funEmoji'];

const avatarStyleList = computed(() =>
  selectedStyles.filter(s => Object.keys(theme.value.avatarStyles).includes(s))
);

const avatars = computed(() =>
  avatarStyleList.value.map(style => ({
    style: kebabCase(style),
    src: `https://api.dicebear.com/9.x/${kebabCase(style)}/svg?seed=${encodeURIComponent(seed.value)}&size=128`
  }))
);

watch(seed, () => {
  isTyping.value = true;
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    isTyping.value = false;
  }, 300);
});

const placeholders = [
  'Type your seed here',
//  'user@email.com',
//  'user-123',
//  'ProjectX',
];

const currentPlaceholder = ref(0);

setInterval(() => {
  currentPlaceholder.value = (currentPlaceholder.value + 1) % placeholders.length;
}, 3000);
</script>

<template>
  <section class="seed-demo">
    <div class="seed-demo-container">
      <div class="seed-demo-left">
        <span class="seed-demo-badge">Deterministic Avatars</span>
        <h2 class="seed-demo-title">Same Seed.<br />Same Avatar.<br /><span class="highlight">Every Time.</span></h2>
        <p class="seed-demo-description">
          Use any string as a seed - usernames, emails, IDs - and DiceBear will always generate the identical avatar. Perfect for user profiles without storing images.
        </p>
        <a href="/introduction/" class="seed-demo-link">
          Learn more
          <svg viewBox="0 0 24 24"><path :d="mdiArrowRight" fill="currentColor" /></svg>
        </a>
      </div>

      <div class="seed-demo-right">
        <div class="seed-demo-card">
          <div class="seed-demo-input-wrapper">
            <label class="seed-demo-label">Enter a seed</label>
            <div class="seed-demo-input-container">
              <svg class="seed-demo-icon" viewBox="0 0 24 24"><path :d="mdiAccount" fill="currentColor" /></svg>
              <input
                v-model="seed"
                type="text"
                class="seed-demo-input"
                :placeholder="placeholders[currentPlaceholder]"
              />
            </div>
          </div>

          <div class="seed-demo-avatars" :class="{ 'is-updating': isTyping }">
            <div
              v-for="avatar in avatars"
              :key="avatar.style"
              class="seed-demo-avatar"
            >
              <img :src="avatar.src" :alt="`${avatar.style} avatar`" loading="lazy" />
            </div>
          </div>

          <a href="/styles/" class="seed-demo-more">
            Discover 25+ more styles
            <svg viewBox="0 0 24 24"><path :d="mdiChevronRight" fill="currentColor" /></svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.seed-demo {
  padding: 80px 24px;
  background: var(--vp-c-bg);
}

.seed-demo-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 64px;
  align-items: center;
}

.seed-demo-badge {
  display: inline-block;
  padding: 6px 14px;
  background: var(--vp-c-purple-soft);
  color: var(--vp-c-purple-1);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
}

.seed-demo-title {
  font-size: 40px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
  line-height: 1.15;
}

.seed-demo-title .highlight {
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-purple-1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.seed-demo-description {
  font-size: 17px;
  color: var(--vp-c-text-2);
  margin: 0 0 24px;
  line-height: 1.7;
}

.seed-demo-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  transition: gap 0.2s ease;
}

.seed-demo-link:hover {
  gap: 10px;
}

.seed-demo-link::after {
  display: none !important;
}

.seed-demo-link svg {
  width: 18px;
  height: 18px;
}

.seed-demo-card {
  background: var(--vp-c-bg-soft);
  border-radius: 20px;
  padding: 32px;
}

.seed-demo-input-wrapper {
  margin-bottom: 28px;
}

.seed-demo-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.seed-demo-input-container {
  display: flex;
  align-items: center;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 0 16px;
  transition: all 0.2s ease;
}

.seed-demo-input-container:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.seed-demo-icon {
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.seed-demo-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 14px 12px;
  font-size: 16px;
  color: var(--vp-c-text-1);
  outline: none;
  min-width: 0;
}

.seed-demo-input::placeholder {
  color: var(--vp-c-text-3);
}

.seed-demo-avatars {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 16px;
  transition: opacity 0.15s ease;
}

.seed-demo-avatars.is-updating {
  opacity: 0.6;
}

.seed-demo-avatar {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-1);
}

.seed-demo-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.seed-demo-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: gap 0.2s ease;
}

.seed-demo-more::after {
  display: none !important;
}

.seed-demo-more:hover {
  gap: 8px;
}

.seed-demo-more svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 900px) {
  .seed-demo-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .seed-demo-left {
    text-align: center;
  }

  .seed-demo-title {
    font-size: 32px;
  }
}

@media (max-width: 640px) {
  .seed-demo {
    padding: 60px 16px;
  }

  .seed-demo-title {
    font-size: 28px;
  }

  .seed-demo-card {
    padding: 24px;
  }

  .seed-demo-avatars {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
