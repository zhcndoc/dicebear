<script setup lang="ts">
import { ref } from 'vue';
import { CircleUser, MessageCircle, Gamepad2, MessagesSquare, Users, Mountain } from 'lucide-vue-next';
import { UiAvatar, UiContainer, UiSection, UiSectionHeader, UiCard, UiIconBox } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const useCases = [
  {
    icon: CircleUser,
    title: 'User Profiles',
    description: 'Give every user a unique avatar from day one. No upload needed.',
    color: '#6366f1',
    avatars: ['alex', 'jamie', 'taylor'],
    style: 'avataaars',
  },
  {
    icon: MessageCircle,
    title: 'Chat Applications',
    description: 'Instantly recognizable participants in conversations.',
    color: '#22c55e',
    avatars: ['chat1', 'chat2', 'chat3'],
    style: 'thumbs',
  },
  {
    icon: Gamepad2,
    title: 'Gaming',
    description: 'Generate unique player identities and NPC characters.',
    color: '#f59e0b',
    avatars: ['player1', 'player2', 'player3'],
    style: 'bottts',
  },
  {
    icon: MessagesSquare,
    title: 'Forums & Communities',
    description: 'Distinct identities that help build community trust.',
    color: '#ec4899',
    avatars: ['user1', 'user2', 'user3'],
    style: 'lorelei',
  },
  {
    icon: Users,
    title: 'Team Tools',
    description: 'Visual distinction for team members in collaborative apps.',
    color: '#14b8a6',
    avatars: ['team1', 'team2', 'team3'],
    style: 'notionists',
  },
  {
    icon: Mountain,
    title: 'Placeholder Images',
    description: 'Beautiful user placeholder images as default profile pictures while users set up their profiles.',
    color: '#8b5cf6',
    avatars: ['default1', 'default2', 'default3'],
    style: 'shapes',
  },
];
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-use-cases-gradient-top"></div>
      <div class="app-use-cases-gradient-bottom"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-use-cases-header"
        badge="Use Cases"
        headline="Built for <strong>Every</strong> Application"
        description="From startups to enterprises, our avatar generator powers random user avatars across all kinds of products."
      />

      <div class="app-use-cases-grid">
        <UiCard
          v-for="(useCase, index) in useCases"
          :key="index"
          padding="lg"
          radius="md"
          class="app-use-cases-card"
          :style="{ '--accent-color': useCase.color, animationDelay: `${index * 0.1}s` }"
        >
          <div class="app-use-cases-card-header">
            <UiIconBox size="md" :color="useCase.color">
              <component :is="useCase.icon" />
            </UiIconBox>
            <div class="app-use-cases-avatars">
              <UiAvatar
                v-for="(seed, i) in useCase.avatars"
                :key="i"
                :style-name="useCase.style"
                :style-options="{ seed, size: 32 }"
                :alt="seed"
                class="app-use-cases-avatar"
                :style="{ zIndex: 3 - i }"
              />
            </div>
          </div>
          <h3 class="app-use-cases-title">{{ useCase.title }}</h3>
          <p class="app-use-cases-description">{{ useCase.description }}</p>
        </UiCard>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-use-cases {
  &-gradient-top {
    top: 0;
    bottom: auto;
    height: 50%;
    background: radial-gradient(ellipse 100% 100% at 20% 0%, color-mix(in srgb, var(--vp-c-indigo-1) 7%, transparent), transparent);
  }

  &-gradient-bottom {
    top: auto;
    bottom: 0;
    height: 50%;
    background: radial-gradient(ellipse 100% 100% at 80% 100%, color-mix(in srgb, var(--vp-c-purple-1) 7%, transparent), transparent);
  }

  &-header {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-card {
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateY(30px);

    .visible & {
      animation: app-use-cases-card-reveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  &-avatars {
    display: flex;
  }

  &-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--vp-c-bg);
    margin-left: -10px;
    background: var(--vp-c-bg-soft);

    &:first-child {
      margin-left: 0;
    }
  }

  &-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 0 8px;
  }

  &-description {
    font-size: 14px;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.6;
  }
}

@keyframes app-use-cases-card-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .app-use-cases {
    &-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 600px) {
  .app-use-cases {
    &-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
