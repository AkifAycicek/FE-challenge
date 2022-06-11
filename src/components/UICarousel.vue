<template>
  <div class="carousel">
    <UIButton class="carousel-btn" variant="light-gray" size="md" circle :disabled="isDisabled(-1)" @click="move(-1)">
      <template #icon> ◀ </template>
    </UIButton>
    <div class="carousel-items" :style="`transform: translateX(${translateX})`">
      <div class="carousel-item" v-for="(item, i) in modelValue" :key="i">
        <img class="carousel-image" loading="lazy" :src="item.src" v-if="item.src" />
        <p class="carousel-text" v-text="item.title" v-if="item.title" />
        <small class="carousel-info" v-text="`${item.info}`" v-if="item.info" />
      </div>
      <slot />
    </div>
    <UIButton class="carousel-btn" variant="light-gray" size="md" circle :disabled="isDisabled(1)" @click="move(1)">
      <template #icon> ▶ </template>
    </UIButton>
  </div>
</template>

<script setup>
import { defineProps, watch, computed, ref } from '@vue/runtime-core';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const index = ref(0);

const root = getComputedStyle(document.querySelector(':root'));
const width = parseFloat(root.getPropertyValue('--carousel_item_width'));
const visibleCount = parseFloat(root.getPropertyValue('--carousel_visible_count'));
const translateX = computed(() => index.value * -width + '%');

const isDisabled = (value) => {
  // to left
  if (value < 0 && index.value >= 0) {
    return false;
  }
  // to right
  if (value > 0 && index.value <= props.modelValue.length - visibleCount) {
    return false;
  }
  return true;
};

const move = (value) => {
  !isDisabled(value) && (index.value += value);
};

watch(
  () => props.modelValue,
  () => (index.value = 0)
);
</script>
