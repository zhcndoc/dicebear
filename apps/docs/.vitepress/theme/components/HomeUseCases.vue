<script setup lang="ts">
import {
  mdiAccountCircle,
  mdiChat,
  mdiGamepad,
  mdiForum,
  mdiAccountGroup,
  mdiImageFilterHdr,
} from '@mdi/js';
import UiHeadline from './UiHeadline.vue';
import UiDescription from './UiDescription.vue';
import UiBadge from './UiBadge.vue';
import UiContainer from './UiContainer.vue';
import UiSection from './UiSection.vue';
import UiCard from './UiCard.vue';
import UiIconBox from './UiIconBox.vue';
import { useVisibility } from '../composables/useVisibility';

const isVisible = useVisibility('.use-cases', { threshold: 0.15 });

const useCases = [
  {
    icon: mdiAccountCircle,
    title: 'User Profiles',
    description: 'Give every user a unique avatar from day one. No upload needed.',
    color: '#6366f1',
    avatars: ['alex', 'jamie', 'taylor'],
    style: 'avataaars',
  },
  {
    icon: mdiChat,
    title: 'Chat Applications',
    description: 'Instantly recognizable participants in conversations.',
    color: '#22c55e',
    avatars: ['chat1', 'chat2', 'chat3'],
    style: 'thumbs',
  },
  {
    icon: mdiGamepad,
    title: 'Gaming',
    description: 'Generate unique player identities and NPC characters.',
    color: '#f59e0b',
    avatars: ['player1', 'player2', 'player3'],
    style: 'bottts',
  },
  {
    icon: mdiForum,
    title: 'Forums & Communities',
    description: 'Distinct identities that help build community trust.',
    color: '#ec4899',
    avatars: ['user1', 'user2', 'user3'],
    style: 'lorelei',
  },
  {
    icon: mdiAccountGroup,
    title: 'Team Tools',
    description: 'Visual distinction for team members in collaborative apps.',
    color: '#14b8a6',
    avatars: ['team1', 'team2', 'team3'],
    style: 'notionists',
  },
  {
    icon: mdiImageFilterHdr,
    title: 'Placeholders',
    description: 'Beautiful defaults while users set up their profiles.',
    color: '#8b5cf6',
    avatars: ['default1', 'default2', 'default3'],
    style: 'shapes',
  },
];
</script>

<template>
  <UiSection class="use-cases" :class="{ visible: isVisible }" divider>
    <UiContainer class="use-cases-container">
      <div class="use-cases-header">
        <UiBadge>Use Cases</UiBadge>
        <UiHeadline>Built for <span class="highlight">Every</span> Application</UiHeadline>
        <UiDescription>
          From startups to enterprises, DiceBear powers avatars across all kinds of products.
        </UiDescription>
      </div>

      <div class="use-cases-grid">
        <UiCard
          v-for="(useCase, index) in useCases"
          :key="index"
          variant="default"
          padding="lg"
          radius="md"
          hoverable
          class="use-case-card"
          :style="{ '--accent-color': useCase.color, animationDelay: `${index * 0.1}s` }"
        >
          <div class="use-case-header">
            <UiIconBox size="md" :color="useCase.color">
              <svg viewBox="0 0 24 24"><path :d="useCase.icon" fill="currentColor" /></svg>
            </UiIconBox>
            <div class="use-case-avatars">
              <img
                v-for="(seed, i) in useCase.avatars"
                :key="i"
                :src="`https://api.dicebear.com/9.x/${useCase.style}/svg?seed=${seed}&size=32`"
                :alt="seed"
                class="use-case-avatar"
                :style="{ zIndex: 3 - i }"
                loading="lazy"
              />
            </div>
          </div>
          <h3 class="use-case-title">{{ useCase.title }}</h3>
          <p class="use-case-description">{{ useCase.description }}</p>
          <div class="use-case-line"></div>
        </UiCard>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style scoped>
.use-cases-container {
  position: relative;
  z-index: 1;
}

.use-cases-header {
  text-align: center;
  margin-bottom: 64px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.use-cases.visible .use-cases-header {
  opacity: 1;
  transform: translateY(0);
}

.use-cases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.use-case-card {
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(30px);
}

.use-cases.visible .use-case-card {
  animation: card-reveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes card-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.use-case-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-color);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.use-case-card:hover .use-case-line {
  transform: scaleX(1);
}

.use-case-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.use-case-avatars {
  display: flex;
}

.use-case-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-bg);
  margin-left: -10px;
  background: var(--vp-c-bg-soft);
}

.use-case-avatar:first-child {
  margin-left: 0;
}

.use-case-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.use-case-description {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .use-cases-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .use-cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>
