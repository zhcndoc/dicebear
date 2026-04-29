<script setup lang="ts">
import { ref } from 'vue';
import { Star, Heart, Scale, ArrowRight } from '@lucide/vue';
import { siGithub } from 'simple-icons';
import { UiButton, UiContainer, UiSection, UiCard, UiIconBox, UiIcon } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-open-source-cards-gradient"></div>
    </template>
    <UiContainer>
      <div class="app-open-source-cards-grid">
        <UiCard padding="xl" radius="lg" class="app-open-source-cards-opensource-card">
          <UiIconBox size="lg" color="#f59e0b">
            <Star />
          </UiIconBox>
          <h3 class="app-open-source-cards-title">开源</h3>
          <p class="app-open-source-cards-text">
            我们相信开源。所有代码都可以在 GitHub 上找到。欢迎贡献、分叉，或者放心直接使用。
          </p>
          <div class="app-open-source-cards-actions">
            <UiButton
              href="https://github.com/dicebear/dicebear"
              variant="github"
              :external="true"
              class="app-open-source-cards-action-btn"
            >
              <UiIcon :path="siGithub.path" :size="20" />
              在 GitHub 上点星
            </UiButton>
            <UiButton href="/guides/contribute-to-the-library/" variant="secondary" class="app-open-source-cards-action-btn">
              <Heart />
              参与贡献
            </UiButton>
          </div>
        </UiCard>

        <UiCard padding="xl" radius="lg" class="app-open-source-cards-license-card">
          <UiIconBox size="lg" color="#22c55e">
            <Scale />
          </UiIconBox>
          <h3 class="app-open-source-cards-title">许可证</h3>
          <p class="app-open-source-cards-text">
            我们的代码采用 MIT 许可。头像风格则使用由创作者选择的不同许可证，
            详情请查看总览页面。
          </p>
          <div class="app-open-source-cards-actions">
            <UiButton href="/licenses/" variant="secondary" class="app-open-source-cards-action-btn app-open-source-cards-license-btn">
              许可证总览
              <ArrowRight :size="20" />
            </UiButton>
          </div>
        </UiCard>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-open-source-cards {
  &-gradient {
    background:
      radial-gradient(ellipse 50% 80% at 50% 0%, color-mix(in srgb, var(--vp-c-yellow-1) 5%, transparent), transparent),
      radial-gradient(ellipse 50% 80% at 50% 100%, color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent), transparent);
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-opensource-card,
  &-license-card {
    display: flex;
    flex-direction: column;
  }

  &-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 20px 0 12px;
  }

  &-text {
    font-size: 15px;
    color: var(--vp-c-text-2);
    line-height: 1.7;
    margin: 0 0 32px;
    flex: 1;
  }

  &-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .app-open-source-cards {
    &-grid {
      grid-template-columns: 1fr;
    }

    &-actions {
      flex-direction: column;
    }

    &-action-btn {
      width: 100%;
    }
  }
}
</style>
