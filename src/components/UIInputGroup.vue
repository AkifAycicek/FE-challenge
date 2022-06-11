<template>
  <fieldset class="input-group" :class="classList">
    <span class="input-group-icon" v-if="$slots.icon">
      <slot name="icon" />
    </span>
    <span class="input-group-label" v-if="$slots.label">
      <slot name="label" />
    </span>
    <slot />
    <small class="input-group-error-text" v-if="$attrs.error" v-text="$attrs.error" :title="$attrs.error" />
  </fieldset>
</template>

<script setup>
import { computed, useAttrs } from '@vue/runtime-core';
const attrs = useAttrs();

const classList = computed(() => ({
  [`input-${attrs.size}`]: attrs.size,
}));
</script>
