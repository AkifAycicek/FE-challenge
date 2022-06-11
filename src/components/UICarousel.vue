<template>
  <div class="carousel" :ref="(carousel) => resizeObserver(carousel)">
    <UIButton class="carousel-btn" variant="light-gray" size="md" circle :disabled="isDisabled(-1)" @click="move(-1)">
      <template #icon> ◀ </template>
    </UIButton>
    <div class="carousel-content">
      <div class="carousel-items" :style="`transform: translateX(${translateX})`">
        <div class="carousel-item" v-for="(item, i) in modelValue" :key="i">
          <div class="carousel-item-body">
            <img class="carousel-image" loading="lazy" :src="item.src" v-if="item.src" />
            <p class="carousel-text" v-text="item.title" v-if="item.title" />
            <small class="carousel-info" v-text="`${item.info}`" v-if="item.info" />
          </div>
        </div>
        <slot />
      </div>
    </div>
    <UIButton class="carousel-btn" variant="light-gray" size="md" circle :disabled="isDisabled(1)" @click="move(1)">
      <template #icon> ▶ </template>
    </UIButton>
  </div>
</template>

<script setup>
import { defineProps, watch, ref } from '@vue/runtime-core';
import debounceFn from '@/utils/debounceFn';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});
let visibleCount = 0,
  width = 0,
  translateX = ref('');

const root = getComputedStyle(document.querySelector(':root')),
  index = ref(0),
  resizeObserver = (carousel) => {
    if (carousel) {
      const observer = new ResizeObserver(changePosition);
      observer.observe(carousel);
    }
  },
  changePosition = () => {
    debounceFn(() => {
      visibleCount = parseFloat(root.getPropertyValue('--carousel_visible_count'));
      width = parseFloat(100 / visibleCount);
      translateX.value = index.value * -width + '%';
    }, 75);
  },
  isDisabled = (value) => {
    // to left
    if (value < 0 && index.value > 0) {
      return false;
    }
    // to right
    if (value > 0 && index.value < props.modelValue.length - visibleCount) {
      return false;
    }
    return true;
  },
  move = (value) => {
    !isDisabled(value) && (index.value += value);
  };

watch(
  () => props.modelValue,
  () => (index.value = 0)
);
</script>
