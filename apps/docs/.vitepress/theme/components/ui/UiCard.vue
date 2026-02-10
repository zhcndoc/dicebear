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
  --ui-card-border-color: rgba(0, 0, 0, 0.08);
}
.dark {
  --ui-card-border-color: rgba(255, 255, 255, 0.08);
}
</style>

<style lang="scss" scoped>
.ui-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--ui-card-border-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

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
    border-radius: 16px;
  }

  &-radius-md {
    border-radius: 20px;
  }

  &-radius-lg {
    border-radius: 24px;
  }

  &-radius-xl {
    border-radius: 28px;
  }

  /* Responsive */
  @media (max-width: 640px) {
    &-padding-lg {
      padding: 24px;
      border-radius: 20px;
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
