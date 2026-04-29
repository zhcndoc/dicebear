<script setup lang="ts">
import { ref } from 'vue';
import { UiContainer, UiSection, UiSectionHeader, UiIconBox, UiCard, UiIcon } from '../ui';
import { Target, Palette, Zap, SlidersHorizontal, Globe } from '@lucide/vue';
import { siGithub } from 'simple-icons';
import { useVisibility } from '../../composables/useVisibility';

withDefaults(defineProps<{
  badge?: string;
  headline?: string;
  description?: string;
}>(), {
  badge: '为什么选择 DiceBear？',
  headline: '为开发者而生，受用户喜爱',
  description: '你需要的一切，都能用来为应用创建美观且独特的头像。',
});

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const highlights = [
  {
    icon: Target,
    title: '确定性头像',
    description: '相同的 seed 总会生成相同的头像，非常适合用户资料和稳定身份。',
    color: '#1689cc',
  },
  {
    icon: Palette,
    title: '30+ 种头像风格',
    description: '来自优秀创作者的精心设计风格，涵盖人物、抽象、像素艺术等。',
    color: '#a855f7',
  },
  {
    icon: Globe,
    title: '免费头像 API',
    description: '我们的头像 API 每天处理数百万请求，全球 CDN 可在毫秒级交付头像。',
    color: '#22c55e',
  },
  {
    icon: Zap,
    title: 'JS 库与 CLI',
    description: '不会向外部服务器发送数据。在你的应用中完全掌控头像生成。',
    color: '#f59e0b',
  },
  {
    icon: SlidersHorizontal,
    title: '高度可定制',
    description: '颜色、配饰、背景等等都可以调节，精细匹配你的品牌。',
    color: '#ec4899',
  },
  {
    iconPath: siGithub.path,
    title: '100% 开源',
    description: '核心代码采用 MIT 许可，开发过程透明。你可以放心贡献、分叉或自托管。',
    color: 'var(--vp-c-text-1)',
  },
];
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-highlights-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-highlights-header"
        :badge="badge"
        :description="description"
      >
        <template #headline>
          <slot name="headline">{{ headline }}</slot>
        </template>
      </UiSectionHeader>

      <div class="app-highlights-grid">
        <UiCard
          v-for="(highlight, index) in highlights"
          :key="index"
          padding="lg"
          radius="md"
          class="app-highlights-card"
          :style="{ '--accent-color': highlight.color, animationDelay: `${index * 0.1}s` }"
        >
          <UiIconBox size="lg" :color="highlight.color" class="app-highlights-icon-wrapper">
            <UiIcon v-if="highlight.iconPath" :path="highlight.iconPath" />
            <component v-else :is="highlight.icon" />
          </UiIconBox>
          <h3 class="app-highlights-title">{{ highlight.title }}</h3>
          <p class="app-highlights-description">{{ highlight.description }}</p>
        </UiCard>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-highlights {
  &-gradient {
    background:
      radial-gradient(ellipse 50% 50% at 50% 0%, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent),
      radial-gradient(ellipse 50% 50% at 50% 100%, color-mix(in srgb, var(--vp-c-purple-1) 6%, transparent), transparent);
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
    opacity: 0;
    transform: translateY(30px);
    transition: box-shadow var(--duration-mid) var(--ease-spring);

    .visible & {
      animation: reveal-up var(--duration-mid) var(--ease-spring) forwards;
    }

    &:hover {
      box-shadow:
        inset 0 3px 0 var(--accent-color),
        0 0 20px color-mix(in srgb, var(--accent-color) 20%, transparent);
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  &-icon-wrapper {
    margin-bottom: 24px;
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
@media (max-width: 1000px) {
  .app-highlights {
    &-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 640px) {
  .app-highlights {
    &-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
}
</style>
