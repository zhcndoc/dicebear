<script setup lang="ts">
import {
  mdiGithub,
  mdiStar,
  mdiAccountGroup,
  mdiViewGrid,
} from '@mdi/js';
</script>

<template>
  <section class="opensource">
    <div class="opensource-container">
      <div class="opensource-icon">
        <svg viewBox="0 0 24 24"><path :d="mdiGithub" fill="currentColor" /></svg>
      </div>

      <h2 class="opensource-title">Free and Open Source. Forever.</h2>

      <p class="opensource-description">
        DiceBear is built in the open. Our core library is MIT licensed, and we believe
        in transparent development. Star us on GitHub, contribute code, or simply use it
        with confidence knowing the source is always available.
      </p>

      <div class="opensource-stats">
        <div class="opensource-stat">
          <span class="stat-icon">
            <svg viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg>
          </span>
          <span class="stat-value">8k+</span>
          <span class="stat-label">GitHub Stars</span>
        </div>
        <div class="opensource-stat">
          <span class="stat-icon">
            <svg viewBox="0 0 24 24"><path :d="mdiAccountGroup" fill="currentColor" /></svg>
          </span>
          <span class="stat-value">10+</span>
          <span class="stat-label">Contributors</span>
        </div>
        <div class="opensource-stat">
          <span class="stat-icon">
            <svg viewBox="0 0 24 24"><path :d="mdiViewGrid" fill="currentColor" /></svg>
          </span>
          <span class="stat-value">30+</span>
          <span class="stat-label">Avatar Styles</span>
        </div>
      </div>

      <div class="opensource-actions">
        <a
          href="https://github.com/dicebear/dicebear"
          target="_blank"
          rel="noopener"
          class="opensource-button primary"
        >
          <svg viewBox="0 0 24 24"><path :d="mdiGithub" fill="currentColor" /></svg>
          View on GitHub
        </a>
        <a
          href="/guides/contribute-to-the-library/"
          class="opensource-button secondary"
        >
          Contribute
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.opensource {
  padding: 80px 24px;
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 50%, var(--vp-c-bg-soft) 100%);
  text-align: center;
}

.opensource-container {
  max-width: 700px;
  margin: 0 auto;
}

.opensource-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  border-radius: 20px;
  box-shadow: var(--vp-shadow-2);
}

.opensource-icon svg {
  width: 40px;
  height: 40px;
  color: var(--vp-c-text-1);
}

.opensource-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
  line-height: 1.2;
}

.opensource-description {
  font-size: 18px;
  color: var(--vp-c-text-2);
  margin: 0 0 48px;
  line-height: 1.7;
}

.opensource-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 48px;
}

.opensource-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: var(--vp-c-brand-1);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.stat-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.opensource-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.opensource-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.opensource-button::after {
  display: none !important;
}

.opensource-button svg {
  width: 20px;
  height: 20px;
}

.opensource-button.primary {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
}

.opensource-button.primary:hover {
  opacity: 0.9;
}

.opensource-button.secondary {
  background: transparent;
  border: 2px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.opensource-button.secondary:hover {
  border-color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .opensource {
    padding: 60px 16px;
  }

  .opensource-title {
    font-size: 28px;
  }

  .opensource-description {
    font-size: 16px;
  }

  .opensource-stats {
    flex-direction: column;
    gap: 24px;
  }

  .opensource-actions {
    flex-direction: column;
  }

  .opensource-button {
    justify-content: center;
  }
}
</style>
