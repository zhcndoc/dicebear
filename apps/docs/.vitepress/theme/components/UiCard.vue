<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'soft' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  flex?: boolean;
}>();
</script>

<template>
  <div
    class="ui-card"
    :class="[
      variant || 'soft',
      `padding-${padding || 'lg'}`,
      `radius-${radius || 'lg'}`,
      { hoverable, flex }
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.ui-card {
  border: 1px solid var(--vp-c-border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Variants */
.ui-card.default {
  background: var(--vp-c-bg);
}

.ui-card.soft {
  background: var(--vp-c-bg-soft);
}

.ui-card.gradient {
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, rgba(111, 66, 193, 0.08) 100%);
}

/* Padding */
.ui-card.padding-sm {
  padding: 20px 24px;
}

.ui-card.padding-md {
  padding: 28px;
}

.ui-card.padding-lg {
  padding: 32px;
}

.ui-card.padding-xl {
  padding: 56px 48px;
}

/* Border radius */
.ui-card.radius-sm {
  border-radius: 16px;
}

.ui-card.radius-md {
  border-radius: 20px;
}

.ui-card.radius-lg {
  border-radius: 24px;
}

.ui-card.radius-xl {
  border-radius: 28px;
}

/* Flex layout */
.ui-card.flex {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

/* Hoverable */
.ui-card.hoverable {
  position: relative;
  overflow: hidden;
}

.ui-card.hoverable:hover {
  transform: translateY(-8px);
  border-color: transparent;
  box-shadow:
    0 20px 40px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px var(--vp-c-border);
}

.dark .ui-card.hoverable:hover {
  box-shadow:
    0 20px 40px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px var(--vp-c-border);
}

/* Responsive */
@media (max-width: 640px) {
  .ui-card.padding-lg {
    padding: 24px;
    border-radius: 20px;
  }

  .ui-card.padding-xl {
    padding: 40px 24px;
  }

  .ui-card.padding-md {
    padding: 24px;
  }
}
</style>
