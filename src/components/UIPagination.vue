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
        :items="perPageItems"
        size="sm"
        :variant="variant"
        :label="`Per Page: ${modelValue.perPage}`"
        :modelValue="modelValue.perPage"
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
      perPage: 1,
      currentPage: 1,
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
  perPageItems: {
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
  perPage: computed(() => props.modelValue.perPage),
  currentPage: computed(() => props.modelValue.currentPage),
  total: computed(() => props.modelValue.total),
  maxVisible: computed(() => props.modelValue.maxVisible),
  lastPage: computed(() => Math.round(state.total / state.perPage + 0.4)),

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

const changePage = async (currentPage = state.currentPage, perPage = state.perPage) => {
  await emit('update:modelValue', { ...props.modelValue, currentPage, perPage });
  await emit('change', { ...props.modelValue, currentPage, perPage });
};
</script>
