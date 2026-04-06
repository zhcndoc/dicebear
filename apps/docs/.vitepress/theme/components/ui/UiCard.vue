<script setup lang="ts">
defineProps<{
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
}>();
</script>

<template>
  <div
    class="ui-card"
    :class="[
      `ui-card-padding-${padding || 'lg'}`,
      `ui-card-radius-${radius || 'lg'}`,
    ]"
  >
    <slot />
  </div>
</template>

<style lang="scss">
:root {
  --ui-card-border-color: rgba(0, 0, 0, 0.06);
  --ui-card-hover-border-color: rgba(0, 0, 0, 0.12);
}
.dark {
  --ui-card-border-color: rgba(255, 255, 255, 0.07);
  --ui-card-hover-border-color: rgba(255, 255, 255, 0.14);
}
</style>

<style lang="scss" scoped>
.ui-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--ui-card-border-color);
  transition: border-color var(--duration-fast) var(--ease-smooth);
  position: relative;

  &:hover {
    border-color: var(--ui-card-hover-border-color);
  }

  /* Padding */
  &-padding-sm {
    padding: var(--card-padding, 20px 24px);
  }

  &-padding-md {
    padding: var(--card-padding, 28px);
  }

  &-padding-lg {
    padding: var(--card-padding, 32px);
  }

  &-padding-xl {
    padding: var(--card-padding, 56px 48px);
  }

  /* Border radius */
  &-radius-sm {
    border-radius: var(--vp-radius-md);
  }

  &-radius-md {
    border-radius: var(--vp-radius-lg);
  }

  &-radius-lg {
    border-radius: var(--vp-radius-xl);
  }

  &-radius-xl {
    border-radius: var(--vp-radius-xl);
  }

  /* Responsive */
  @media (max-width: 640px) {
    &-padding-lg {
      padding: 24px;
      border-radius: var(--vp-radius-lg);
    }

    &-padding-xl {
      padding: 40px 24px;
    }

    &-padding-md {
      padding: 24px;
    }
  }
}
</style>
