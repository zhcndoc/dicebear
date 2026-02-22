<template>
  <div class="ui-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.ui-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;

  @media (max-width: 640px) {
    padding: 0 16px;
  }
}
</style>
