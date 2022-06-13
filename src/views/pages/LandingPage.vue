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
        :modelValue="state.search"
        @input="state.search = $event.target.value.trim()"
        :placeholder="`Name, username or email`"
        :error="form.errors.get('search').join(' ')"
        :loading="users.loading"
      >
        <template #icon> 🔍 </template>
      </UIInput>
      <router-link custom :to="{ name: 'ListPage', query: $route.query }" v-slot="{ navigate }">
        <UIButton
          variant="primary"
          class="landing-page-search-btn"
          @click="navigate"
          :loading="users.loading"
          :error="form.errors.get('search').length > 0 ? ' ' : ''"
          :disabled="users.data.length < 1"
        >
          Search
        </UIButton>
      </router-link>
      <div class="landing-page-search-result" v-if="users.data.length > 0">
        <div class="landing-page-search-result-item" v-for="user in users.data" :key="user.userName">
          <i>📍</i>
          <div class="address">
            <p v-text="`${user.firstName} ${user.lastName} - ${user.username}`" />
            <p v-text="user.address.address" />
            <small v-text="user.address.city" />
          </div>
        </div>
        <router-link custom :to="{ name: 'ListPage', query: $route.query }" v-slot="{ navigate }">
          <UIButton
            class="landing-page-search-more"
            size="sm"
            :loading="users.loading"
            :disabled="users.data.length < 1"
            @click="navigate"
          >
            Show more...
          </UIButton>
        </router-link>
      </div>
    </div>
    <UICarousel :modelValue="state.posts" />
  </div>
</template>

<script setup>
import { reactive, watch } from '@vue/runtime-core';
import { handleNotification } from '@/utils/notification.js';
import { useRouter } from 'vue-router';
import debounceFn from '@/utils/debounceFn';
import { computed } from '@vue/reactivity';
import useUsers from '@/composables/useUsers';
import useForm from '@/composables/useForm';

const state = reactive({
    posts: [],
    router: useRouter(),
    minSearchLetters: 2,
    search: computed({
      get() {
        return state.router.currentRoute.query.q || '';
      },
      set: async (q) => {
        debounceFn(() => state.router.push({ query: { q } }), 750);
      },
    }),
    paragraphs: [
      'Excepteur laborum enim, porchetta beef ribs et capicola.  Leberkas aliquip duis tenderloin.  Kevin short loin shankle commodo officia.  T-bone deserunt chicken dolore picanha id ut salami esse ex cupidatat occaecat velit.  Burgdoggen do .',
      'Alcatra kevin commodo strip steak.  Jowl incididunt corned beef cillum occaecat turkey andouille.  Strip steak voluptate ullamco fugiat bacon anim.  Flank nostrud turducken ut, commodo cupim ipsum anim shoulder beef proident beef ribs nu.',
      'In drumstick ham ham hock exercitation jowl ball tip. Jowl incididunt corned beef cillum occaecat turkey andouille.  Strip steak voluptate ullamco fugiat bacon anim.',
      'Irure pig lorem laborum landjaeger tempor eiusmod ut porchetta.Leberkas aliquip duis tenderloin.  Kevin short loin shankle commodo officia.  T-bone deserunt chicken dolore picanha id ut salami esse ex cupidatat occaecat velit.',
      'Shankle minim alcatra, aliquip pancetta corned beef laborum buffalo picanha mollit. Jowl incididunt corned beef cillum occaecat turkey andouille.  Strip steak voluptate ullamco fugiat bacon anim.',
    ],
  }),
  form = useForm({ search: state.router.currentRoute.query.q }, { search: 'required|min:2' }),
  users = reactive(useUsers()),
  loadPosts = async () => {
    try {
      const params = {
        limit: 5,
        skip: Math.round(Math.random() * 25),
      };

      const { data } = await users.fetchUsers(params);
      state.posts = data.users.map((post) => {
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
  };

loadPosts();

watch(
  () => state.router.currentRoute.query,
  async ({ q }) => {
    try {
      users.data = [];
      form.search = q;
      if (await form.isValid()) {
        users.loadUsers({ ...state.router.currentRoute.query, limit: 3 });
      }
    } catch (error) {
      handleNotification(error);
    }
  },
  { flush: 'post', immediate: !!form.search, deep: true }
);
</script>
