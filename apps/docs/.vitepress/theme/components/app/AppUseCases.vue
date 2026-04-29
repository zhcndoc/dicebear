<script setup lang="ts">
import { ref } from 'vue';
import { CircleUser, MessageCircle, Gamepad2, MessagesSquare, Users, Mountain } from '@lucide/vue';
import { UiAvatar, UiContainer, UiSection, UiSectionHeader, UiCard, UiIconBox } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const useCases = [
  {
    icon: CircleUser,
    title: '用户资料',
    description: '从第一天起就为每个用户提供独一无二的头像，无需上传。',
    color: '#6366f1',
    avatars: ['alex', 'jamie', 'taylor'],
    style: 'avataaars',
  },
  {
    icon: MessageCircle,
    title: '聊天应用',
    description: '让对话中的参与者一眼可识别。',
    color: '#22c55e',
    avatars: ['chat1', 'chat2', 'chat3'],
    style: 'thumbs',
  },
  {
    icon: Gamepad2,
    title: '游戏',
    description: '生成独特的玩家身份和 NPC 角色。',
    color: '#f59e0b',
    avatars: ['player1', 'player2', 'player3'],
    style: 'bottts',
  },
  {
    icon: MessagesSquare,
    title: '论坛与社区',
    description: '通过鲜明身份帮助建立社区信任。',
    color: '#ec4899',
    avatars: ['user1', 'user2', 'user3'],
    style: 'lorelei',
  },
  {
    icon: Users,
    title: '团队工具',
    description: '在协作应用中，让团队成员在视觉上更易区分。',
    color: '#14b8a6',
    avatars: ['team1', 'team2', 'team3'],
    style: 'notionists',
  },
  {
    icon: Mountain,
    title: '占位图片',
    description: '在用户设置资料之前，用精美的默认头像作为占位图。',
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
        badge="使用场景"
        description="从初创公司到大型企业，DiceBear 为各种产品提供随机用户头像。"
      >
        <template #headline>为<strong>每一个</strong>应用而生</template>
      </UiSectionHeader>

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
    transition: all var(--duration-reveal) var(--ease-smooth);

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
    transition: box-shadow var(--duration-mid) var(--ease-spring);

    &:hover {
      box-shadow:
        inset 0 3px 0 var(--accent-color),
        0 0 20px color-mix(in srgb, var(--accent-color) 20%, transparent);
    }

    .visible & {
      animation: reveal-up var(--duration-slow) var(--ease-spring) forwards;
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
    margin-left: -14px;
    background: var(--vp-c-bg-soft);
    transition: transform var(--duration-mid) var(--ease-spring);

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
