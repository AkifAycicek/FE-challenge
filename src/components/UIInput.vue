<template>
  <UIInputGroup v-bind="$attrs" :class="{ [`input-${$attrs.size}`]: $attrs.size }">
    <template #icon v-if="$slots.icon">
      <slot name="icon" />
    </template>
    <template #label v-if="label">
      <label :for="id" v-text="label" />
    </template>
    <input class="inputbox" :id="id" type="text" :placeholder="$attrs.placeholder" />
  </UIInputGroup>
</template>

<script setup>
import { defineProps } from '@vue/runtime-core';

defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
});

const id = '_' + Math.random().toString(16).substring(2, 10);
</script>
