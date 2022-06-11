<template>
  <UIInputGroup @click.stop>
    <button class="btn" :class="classList">
      <slot name="icon" />
      <slot />
    </button>
  </UIInputGroup>
</template>
<script></script>

<script setup>
import { computed, defineProps } from '@vue/runtime-core';

const props = defineProps({
  variant: {
    type: String,
    default: null,
  },
  outline: {
    type: Boolean,
    default: false,
  },
  circle: {
    type: Boolean,
    default: false,
  },
});

const classList = computed(() => ({
  [`btn-${props.variant}`]: props.variant,
  [`btn-outline`]: props.outline,
  [`btn-circle`]: props.circle,
}));
</script>
