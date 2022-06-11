<template>
  <div class="demo">
    <div>
      <UIButton
        :outline="state.getRandomBoolean()"
        :variant="state.getRandomVariant()"
        v-for="(size, i) in state.sizes"
        :size="size"
        :key="'btn_' + i"
        :error="state.errorMessage()"
        :circle="Math.round(Math.random())"
      >
        <template #icon>
          <i>♥</i>
        </template>
      </UIButton>
      <UIButton
        :variant="state.getRandomVariant()"
        v-for="(size, i) in state.sizes"
        :size="size"
        :key="'btn_' + i"
        :error="state.errorMessage()"
      >
        <template #icon v-if="i % 2 == 0">
          <i>🎁</i>
        </template>
        {{ i % 2 == 0 }}
      </UIButton>
      <UIButton :variant="state.getRandomVariant()" size="xl" @click="showNotification(state.getRandomNotification())">
        <template #icon>
          <i>💀</i>
        </template>
      </UIButton>
    </div>
    <div>
      <UIInput
        v-for="(size, i) in state.sizes"
        :key="'input_' + i"
        :placeholder="'Placeho... Hodor??'"
        variant="primary"
        :label="(state.getRandomBoolean() && `Inputbox ${i + 1}`) || null"
        :size="size"
        :error="state.errorMessage()"
      >
        <template #icon v-if="i % 2 == 0">
          <i>🚪</i>
        </template>
      </UIInput>
    </div>
    <div>
      <UISelect
        v-for="(size, i) in state.sizes"
        :key="'input_' + i"
        :outline="state.getRandomBoolean()"
        :label="`Selectbox ${i + 1}`"
        :error="state.errorMessage()"
        :size="size"
        v-model:modelValue="state.selectValue"
        :items="state.selectOptions"
        :variant="state.getRandomVariant()"
      >
        <template #icon v-if="i % 2 == 0">
          <i>⚖</i>
        </template>
        <option value="with template 1">with template 1</option>
        <option value="with template 2">with template 2</option>
      </UISelect>
    </div>
    <UICarousel :modelValue="state.posts" />
    <UIPagination v-model="state.pagination" :disabled="state.loading" :loading="state.loading" @change="pageChanged" />
  </div>
</template>

<script setup>
import { onBeforeMount, reactive } from '@vue/runtime-core';
import { showNotification } from '@/utils/notification';
import Http from '@/utils/httpClient';

const state = reactive({
  posts: [],
  sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
  selectOptions: [...Array(15)].map((e, i) => ({ value: `with_prop_${i + 1}`, text: `with prop ${i + 1}` })),
  selectValue: null,
  pagination: {
    perPage: 5,
    currentPage: 1,
    total: 1,
    maxVisible: 3,
  },
  getRandomVariant: () => ['primary', 'warning', 'success', 'error', 'danger', 'info'][Math.round(Math.random() * 5)],
  getRandomBoolean: () => [true, false][Math.round(Math.random())],
  errorMessage: () => (Math.round(Math.random()) && 'error occurred') || false,
  getRandomNotification: () => ({
    title: 'Title ' + Math.random().toString(16).substring(2, 10),
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates quo odio voluptatibus accusamus atque beatae architecto dolor earum voluptatem, nihil veniam quia. Reprehenderit, deleniti excepturi provident possimus nulla blanditiis rem?'.slice(
      0,
      -Math.random() * 200
    ),
    variant: state.getRandomVariant(),
  }),
  loading: false,
});

const pageChanged = async () => {
  await loadPosts();
};

const loadPosts = async () => {
  try {
    state.loading = true;
    const params = {
      skip: (state.pagination.currentPage - 1) * state.pagination.perPage,
      limit: state.pagination.perPage,
    };

    const { data } = await Http.get('posts', { params });
    const { posts, total } = data;

    state.posts = posts.map((post) => {
      const date = new Date(Math.random() * Date.now()).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      post.src = 'https://picsum.photos/200/300';
      post.info = `${date} by ${post.userId}`;
      return post;
    });

    state.pagination = { ...state.pagination, total };
  } catch (error) {
    console.error(error);
  } finally {
    state.loading = false;
  }
};

onBeforeMount(async () => {
  await loadPosts();
  state.pagination = {
    ...state.pagination,
    totalItems: state.posts.length,
  };
});
</script>

<style lang="scss">
.demo {
  display: flex;
  flex-direction: column;
  gap: $spacer * 2;
}
</style>
