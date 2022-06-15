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
        :circle="state.getRandomBoolean()"
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
      <UIButton
        :variant="state.getRandomVariant()"
        size="xl"
        @click="handleNotification(state.getRandomNotification())"
      >
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
    <UICarousel :modelValue="posts.data" />
    <UIPagination v-model="posts.pagination" :disabled="posts.loading" :loading="posts.loading" @change="pageChanged" />
  </div>
</template>

<script setup>
import { reactive } from '@vue/runtime-core';
import { handleNotification } from '@/utils/notification';
import useUsers from '@/composables/useUsers';

const state = reactive({
    sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
    selectOptions: [...Array(15)].map((e, i) => ({ value: `with_prop_${i + 1}`, text: `with prop ${i + 1}` })),
    selectValue: null,
    getRandomVariant: () => ['primary', 'warning', 'success', 'error', 'danger', 'info'][Math.round(Math.random() * 5)],
    getRandomBoolean: () => [true, false][Math.round(Math.random())],
    errorMessage: () => (Math.round(Math.random()) && 'error occurred') || null,
    getRandomNotification: () => ({
      title: 'Title ' + Math.random().toString(16).substring(2, 10),
      message:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates quo odio voluptatibus accusamus atque beatae architecto dolor earum voluptatem, nihil veniam quia. Reprehenderit, deleniti excepturi provident possimus nulla blanditiis rem?'.slice(
          0,
          -Math.random() * 200
        ),
      variant: state.getRandomVariant(),
    }),
    paragraphs: [
      'Excepteur laborum enim, porchetta beef ribs et capicola.  Leberkas aliquip duis tenderloin.  Kevin short loin shankle commodo officia.  T-bone deserunt chicken dolore picanha id ut salami esse ex cupidatat occaecat velit.  Burgdoggen do .',
      'Alcatra kevin commodo strip steak.  Jowl incididunt corned beef cillum occaecat turkey andouille.  Strip steak voluptate ullamco fugiat bacon anim.  Flank nostrud turducken ut, commodo cupim ipsum anim shoulder beef proident beef ribs nu.',
      'In drumstick ham ham hock exercitation jowl ball tip. Jowl incididunt corned beef cillum occaecat turkey andouille.  Strip steak voluptate ullamco fugiat bacon anim.',
      'Irure pig lorem laborum landjaeger tempor eiusmod ut porchetta.Leberkas aliquip duis tenderloin.  Kevin short loin shankle commodo officia.  T-bone deserunt chicken dolore picanha id ut salami esse ex cupidatat occaecat velit.',
      'Shankle minim alcatra, aliquip pancetta corned beef laborum buffalo picanha mollit. Jowl incididunt corned beef cillum occaecat turkey andouille.  Strip steak voluptate ullamco fugiat bacon anim.',
    ],
  }),
  posts = reactive(useUsers()),
  pageChanged = async () => {
    await loadPosts();
  },
  loadPosts = async () => {
    try {
      await posts.loadUsers(posts.pagination);
      posts.data.map((post) => {
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
      handleNotification({
        title: 'success',
        message: `between ${parseInt(posts.pagination.skip) + 1}-${
          parseInt(posts.pagination.skip) + parseInt(posts.pagination.limit)
        } posts loaded `,
        variant: 'success',
        closeIn: 0,
      });
    } catch (error) {
      handleNotification(error);
    }
  };

loadPosts();
</script>

<style lang="scss">
.demo {
  display: flex;
  flex-direction: column;
  gap: $spacer * 2;
}
</style>
