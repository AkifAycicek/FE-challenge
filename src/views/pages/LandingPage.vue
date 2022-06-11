<template>
  <div class="landing-page">
    <div class="landing-page-header">
      <UIButton variant="primary" @click="$router.push({ name: 'PlayGround' })"> Add new record </UIButton>
    </div>
    <div class="landing-page-logo">
      <img :src="require('@/assets/logo.png')" alt="logo" />
    </div>
    <div class="landing-page-search">
      <UIInput
        label="Find in records"
        class="landing-page-search-input"
        :modelValue="state.searchQuery"
        @input="state.searchQuery = $event.target.value.trim()"
        @change="state.searchQuery = $event.target.value.trim()"
        :placeholder="`Name, username or email`"
        :error="
          !!state.searchQuery &&
          state.searchQuery.length < state.minSearchLetters &&
          `At least ${state.minSearchLetters} character`
        "
        :loading="state.loading"
      >
        <template #icon> 🔍 </template>
      </UIInput>
      <UIButton
        variant="primary"
        class="landing-page-search-btn"
        @click="state.searchQuery = state.searchQuery"
        :error="
          !state.loading &&
          state.searchQuery.length >= state.minSearchLetters &&
          state.users.length <= 0 &&
          'Users not found'
        "
        :loading="state.loading"
        :disabled="state.loading || state.searchQuery.length < state.minSearchLetters"
      >
        Search
      </UIButton>
      <div class="landing-page-search-result" v-if="state.users.length > 0">
        <div class="landing-page-search-result-item" v-for="user in state.users" :key="user.userName">
          <i>📍</i>
          <div class="address">
            <p v-text="`${user.firstName} ${user.lastName} - ${user.username}`" />
            <p v-text="user.address.address" />
            <small v-text="user.address.city" />
          </div>
        </div>
        <UIButton size="sm" class="landing-page-search-more"> Show more... </UIButton>
      </div>
    </div>
    <UICarousel :modelValue="state.posts" />
  </div>
</template>

<script setup>
import { reactive, watch } from '@vue/runtime-core';
import httpClient from '@/utils/httpClient';
import { handleNotification } from '@/utils/notification.js';
import { useRouter } from 'vue-router';
import debounceFn from '@/utils/debounceFn';
import { computed } from '@vue/reactivity';

const state = reactive({
  loading: false,
  posts: [],
  users: [],
  router: useRouter(),
  minSearchLetters: 2,
  searchQuery: computed({
    get() {
      return state.router.currentRoute.query.q || '';
    },
    set: (q) => {
      debounceFn(() => state.router.push({ query: { q } }), 500);
    },
  }),
  paragraphs: [
    'Excepteur laborum enim, porchetta beef ribs et capicola.  Leberkas aliquip duis tenderloin.  Kevin short loin shankle commodo officia.  T-bone deserunt chicken dolore picanha id ut salami esse ex cupidatat occaecat velit.  Burgdoggen do .',
    'Alcatra kevin commodo strip steak.  Jowl incididunt corned beef cillum occaecat turkey andouille.  Strip steak voluptate ullamco fugiat bacon anim.  Flank nostrud turducken ut, commodo cupim ipsum anim shoulder beef proident beef ribs nu.',
    'In drumstick ham ham hock exercitation jowl ball tip.',
    'Irure pig lorem laborum landjaeger tempor eiusmod ut porchetta.',
    'Shankle minim alcatra, aliquip pancetta corned beef laborum buffalo picanha mollit.',
  ],
});

const loadPosts = async () => {
    try {
      const params = {
        limit: 5,
      };

      const { data } = await httpClient.get('users', { params });
      const { users } = data;

      // Yes it's not a `posts` :))
      state.posts = users.map((post) => {
        const date = new Date(Math.random() * Date.now()).toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        post.title = state.paragraphs[Math.round(Math.random() * (state.paragraphs.length - 1))];
        post.src = post.image;
        post.info = `${date} by ${post.username}`;
        return post;
      });
    } catch (error) {
      handleNotification(error);
    }
  },
  loadUsers = async (params) => {
    try {
      if (params.q.length >= state.minSearchLetters) {
        state.loading = true;
        const { data } = await httpClient.get('users/search', { params });
        const { users } = data;
        state.users = users;
        return;
      }
      state.users = [];
    } catch (error) {
      handleNotification(error);
    } finally {
      state.loading = false;
    }
  };

watch(
  () => state.router.currentRoute.query,
  (newQuery, oldQuery) => {
    if ((newQuery && newQuery.q) || (oldQuery && oldQuery.q)) {
      loadUsers({ ...state.router.currentRoute.query, limit: 3 });
    }
  },
  { flush: 'post', immediate: true }
);
loadPosts();
</script>
