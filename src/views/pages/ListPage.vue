<template>
  <div class="search-page">
    <div class="search-page-header">
      <div class="search-page-search">
        <UIInput
          :modelValue="form.search"
          class="search-page-search-input"
          @input="state.search = $event.target.value.trim()"
          @keyup.enter="form.isValid() && debounceFn(() => users.loadUsers({ ...state.route.query }), 500)"
          :placeholder="`Name, username or email`"
          :error="form.errors.get('search').join(' ')"
        >
          <template #icon> 🔍 </template>
        </UIInput>
        <UIButton
          variant="primary"
          class="search-page-search-btn"
          @click="form.isValid() && users.loadUsers({ ...state.route.query })"
          :loading="users.loading"
          :disabled="users.loading || form.errors.has('search')"
          :error="form.errors.get('search').length > 0 ? ' ' : ''"
        >
          Search
        </UIButton>
      </div>
      <UIButton variant="primary" @click="$router.push({ name: 'AddRecord', query: { backToPage: $route.name } })">
        Add new record
      </UIButton>
    </div>
    <div class="search-page-result">
      <div class="search-page-result-item" v-for="user in users.data" :key="user.userName">
        <i>📍</i>
        <div class="search-page-result-item-address">
          <p v-text="user.address.address" />
          <small v-text="user.address.city" />
        </div>
        <div class="search-page-result-item-user">
          <p
            v-html="`${user.firstName} ${user.lastName}`.replace(new RegExp(`${form.search}`, 'gi'), searchHightlight)"
          />
          <small v-html="`${searchHightlight(user.username)}`" />
          <small v-html="`${searchHightlight(user.email)}`" />
        </div>
      </div>
    </div>
    <UIPagination
      v-model="users.pagination"
      :disabled="users.loading || users.data.length <= 0 || form.errors.has('search')"
      size="xs"
      :loading="users.loading"
      @change="$router.push({ query: { ...$route.query, skip: $event.skip, limit: $event.limit } })"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import debounceFn from '@/utils/debounceFn';
import { computed } from '@vue/reactivity';
import { reactive, watch, onMounted } from '@vue/runtime-core';
import useUsers from '@/composables/useUsers';
import useForm from '@/composables/useForm';
import { handleNotification } from '@/utils/notification';

const state = reactive({
    router: useRouter(),
    route: useRoute(),
    minSearchLetters: 2,
    search: computed({
      get() {
        return form.search || '';
      },
      set: (q) => {
        try {
          users.loading = true;
          debounceFn(() => {
            state.router.push({ query: { ...state.route.query, q, skip: 0 } });
            users.loading = false;
          }, 250);
        } catch (error) {
          handleNotification(error);
        }
      },
    }),
  }),
  form = useForm({ search: state.route.query.q }, { search: `required|min:${state.minSearchLetters}` }),
  users = reactive(useUsers()),
  searchHightlight = (text = '') => {
    return text.replace(
      new RegExp(`${form.search}`, 'gi'),
      (search) => '<span class="highlight-background">' + search + '</span>'
    );
  };

onMounted(async () => {
  if (state.route.query.q && form.isValid()) {
    users.loadUsers(state.route.query);
  }
});

watch(
  // first parameter is route query without the q (state.search) used for input search, second is q's itself
  // eslint-disable-next-line no-unused-vars
  () => [(({ q, ...query }) => query)(state.route.query), state.route.query.q],
  async (
    [query, q] = [
      /**newVal */
    ],
    [oldQuery, oldQ] = [
      /**oldVal */
    ]
  ) => {
    try {
      users.data = [];
      form.search = q;
      if (!form.isValid()) return;

      // pagination changed or page loaded
      if (JSON.stringify(query) != JSON.stringify(oldQuery) && q == oldQ) {
        await users.loadUsers({ ...state.route.query });
      }
    } catch (error) {
      handleNotification(error);
    }
  },
  { flush: 'post', immediate: !!form.search, deep: true }
);
</script>
