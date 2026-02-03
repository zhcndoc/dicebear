<template>
  <p class="ui-description">
    <slot />
  </p>
</template>

<style scoped>
.ui-description {
  font-size: 18px;
  color: var(--vp-c-text-2);
  margin: 0 auto;
  max-width: 500px;
  line-height: 1.7;
}

@media (max-width: 640px) {
  .ui-description {
    font-size: 16px;
  }
}
</style>
