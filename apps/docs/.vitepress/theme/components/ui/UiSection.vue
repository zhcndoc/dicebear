<script setup lang="ts">
defineProps<{
  divider?: boolean;
  center?: boolean;
}>();
</script>

<template>
  <section
    class="ui-section"
    :class="{
      'ui-section-has-divider': divider,
      'ui-section-text-center': center,
    }"
  >
    <div v-if="$slots.background" class="ui-section-bg">
      <slot name="background" />
    </div>
    <div class="ui-section-foreground">
      <slot />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.ui-section {
  padding: 100px 0;
  position: relative;
  overflow: hidden;

  &-has-divider::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--vp-c-border), transparent);
  }

  &-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  &-text-center {
    text-align: center;
  }

  &-foreground {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 640px) {
    padding: 80px 0;

    &-no-padding {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>

<style>
.ui-section-bg > * {
  position: absolute;
  inset: 0;
}
</style>
