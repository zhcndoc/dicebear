<script setup lang="ts">
import { ref, useSlots, computed } from 'vue';
import { Play, ArrowRight } from 'lucide-vue-next';
import { UiAvatar, UiButton, UiHeadline, UiDescription, UiBadge, UiContainer, UiSection } from '../ui';
import { useVisibility } from '../../composables/useVisibility';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.1 });

const slots = useSlots();
const hasAside = computed(() => !!slots.aside);
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }">
    <template #background>
      <div class="app-small-hero-gradient"></div>
    </template>
    <UiContainer :size="hasAside ? 'wide' : 'narrow'" class="app-small-hero-container" :class="{ 'app-small-hero-container--has-aside': hasAside }">
      <div :class="{ 'app-small-hero-layout': hasAside }">
        <div>
          <UiBadge>Why DiceBear?</UiBadge>
          <UiHeadline tag="h1">Avatars That <strong>Stand Out</strong></UiHeadline>
          <UiDescription class="app-small-hero-description">
            DiceBear is an avatar generator and avatar library that creates unique profile pictures in no time. Whether you need geometric shapes,
            cute characters, or pixel art &mdash; our avatar maker with 30+ styles brings your projects to life.
          </UiDescription>

          <div class="app-small-hero-actions">
            <UiButton href="/playground/" class="app-small-hero-action-btn">
              <Play :size="20" />
              Try Playground
            </UiButton>
            <UiButton href="/styles/" variant="secondary" class="app-small-hero-action-btn">
              Browse Styles
              <ArrowRight :size="20" class="app-small-hero-arrow-icon" />
            </UiButton>
          </div>
        </div>

        <div v-if="hasAside" class="app-small-hero-aside">
          <slot name="aside" />
        </div>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-small-hero {
  &-gradient {
    background:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(22, 137, 204, 0.12), transparent),
      radial-gradient(ellipse 60% 40% at 80% 50%, rgba(111, 66, 193, 0.08), transparent);
  }

  &-container {
    text-align: center;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }

    &--has-aside {
      text-align: left;

      .app-small-hero-description {
        margin-inline: 0;
      }

      .app-small-hero-actions {
        justify-content: flex-start;
      }

      .app-small-hero-avatars {
        justify-content: flex-start;
      }
    }
  }

  &-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 48px;
  }

  &-aside {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  &-description {
    margin-bottom: 40px;
    max-width: 550px;
  }

  &-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  &-avatars {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  &-avatar {
    width: 72px;
    height: 72px;
    border-radius: 16px;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    transition: all 0.3s ease;

    &::after {
      display: none !important;
    }

    .visible & {
      animation: app-small-hero-avatar-reveal 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    &:hover {
      transform: translateY(-8px) scale(1.1);
      box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.2);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

@keyframes app-small-hero-avatar-reveal {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .app-small-hero {
    &-layout {
      grid-template-columns: 1fr;
    }

    &-container--has-aside {
      text-align: center;

      .app-small-hero-description {
        margin-inline: auto;
      }

      .app-small-hero-actions {
        justify-content: center;
      }

      .app-small-hero-avatars {
        justify-content: center;
      }
    }

    &-actions {
      flex-direction: column;
      align-items: center;

      .app-small-hero-action-btn {
        width: 100%;
        max-width: 280px;
      }
    }

    &-avatar {
      width: 56px;
      height: 56px;
      border-radius: 12px;
    }
  }
}
</style>
