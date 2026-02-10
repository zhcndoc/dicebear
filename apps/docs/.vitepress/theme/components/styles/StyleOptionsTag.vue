<script setup lang="ts">
defineProps<{
  name: string;
  value: unknown;
}>();
</script>

<template>
  <span class="style-options-tag">
    {{ name }}
    <code>{{ value }}</code>
  </span>
</template>

<style scoped lang="scss">
.style-options-tag {
  display: inline-flex;
  align-items: center;
  padding: 0 0 0 12px;
  border-radius: 6px;
  margin-right: 16px;
  height: 32px;
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);

  code {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0 12px;
    line-height: 20px;
    margin-left: 12px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 14px;
  }
}
</style>
