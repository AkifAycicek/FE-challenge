<template>
  <UIInputGroup>
    <div class="pagination">
      <UIButton
        outline
        :variant="variant"
        :size="size"
        :disabled="state.currentPage <= 1"
        @click="changePage(state.currentPage - 1)"
        >{{ 'Previous' }}
      </UIButton>

      <UIButton
        v-for="(page, i) in state.leftPages"
        @click="changePage(page)"
        :outline="state.currentPage != page"
        :variant="variant"
        :size="size"
        :key="'left_' + i"
        >{{ page }}
      </UIButton>

      <template v-if="state.lastPage - state.maxVisible > Math.max(state.maxVisible, state.currentPage)">
        <UIButton
          class="pagination-dots"
          outline
          :size="size"
          @click="changePage(state.currentPage + state.maxVisible)"
          >{{ '•••' }}</UIButton
        >
      </template>

      <UIButton
        v-for="(page, i) in state.rightPages"
        @click="changePage(page)"
        :outline="state.currentPage != page"
        :variant="variant"
        :size="size"
        :key="'right_' + i"
        >{{ page }}
      </UIButton>

      <UIButton
        outline
        :variant="variant"
        :size="size"
        :disabled="state.currentPage >= state.lastPage"
        @click="changePage(1 + state.currentPage)"
        >{{ 'Next' }}
      </UIButton>

      <UISelect
        outline
        :items="limitOptions"
        size="sm"
        :variant="variant"
        :label="`Per Page: ${modelValue.limit}`"
        :modelValue="modelValue.limit"
        @change="changePage(1, $event.target.value)"
      />
    </div>
  </UIInputGroup>
</template>

<script setup>
import { computed, defineProps, defineEmits, reactive } from '@vue/runtime-core';
const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      limit: 1,
      skip: 0,
      total: 1,
      maxVisible: 1,
    }),
  },
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'sm', // xs,sm,md,lg,xl
  },
  limitOptions: {
    type: Array,
    default: () => [
      { value: 5, text: 5 },
      { value: 10, text: 10 },
      { value: 15, text: 15 },
      { value: 20, text: 20 },
      { value: 30, text: 30 },
    ],
  },
});

const state = reactive({
  limit: computed(() => props.modelValue.limit),
  currentPage: computed(() => props.modelValue.skip / props.modelValue.limit + 1),
  total: computed(() => props.modelValue.total),
  maxVisible: computed(() => props.modelValue.maxVisible),
  lastPage: computed(() => Math.round(state.total / state.limit + 0.4)),

  leftPages: computed(() =>
    [...Array(Math.min(state.maxVisible, state.lastPage))]
      .map((e, i) => {
        let page = Math.min(state.currentPage, state.lastPage - state.maxVisible) - i;
        page < 1 && (page += state.maxVisible);
        return page;
      })
      .sort((a, b) => a - b)
  ),
  rightPages: computed(() => {
    return [...Array(Math.min(state.lastPage - state.leftPages.length, state.maxVisible))]
      .map((e, i) => state.lastPage - i)
      .reverse();
  }),
});

const changePage = async (currentPage = state.currentPage, limit = state.limit) => {
  const skip = (currentPage - 1) * limit;
  await emit('update:modelValue', { ...props.modelValue, skip, limit });
  await emit('change', { ...props.modelValue, skip, limit });
};
</script>
