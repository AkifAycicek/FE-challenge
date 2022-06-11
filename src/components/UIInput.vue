<template>
  <UIInputGroup v-bind="$attrs" :class="{ [`input-${$attrs.size}`]: $attrs.size }">
    <template #icon v-if="$slots.icon">
      <slot name="icon" />
    </template>
    <template #label v-if="label">
      <label :for="id" v-text="label" />
    </template>
    <textarea
      class="inputbox"
      :id="id"
      v-if="$attrs.type == 'textarea'"
      cols="30"
      rows="3"
      :placeholder="$attrs.placeholder"
      @change="$emit('update:modelValue', $event.target.value)"
      @input="$emit('update:modelValue', $event.target.value)"
      :value="modelValue"
    />
    <input
      class="inputbox"
      @change="$emit('update:modelValue', $event.target.value)"
      @input="$emit('update:modelValue', $event.target.value)"
      v-else
      :value="modelValue"
      :id="id"
      type="text"
      :placeholder="$attrs.placeholder"
    />
    <slot />
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
