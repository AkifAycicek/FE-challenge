<template>
  <div class="default-page">
    <div class="default-page-header">
      <router-link :to="{ name: 'LandingPage', query: $route.query }" v-slot="{ href }">
        <a :href="href">
          <img :src="require('@/assets/logo.png')" alt="logo" class="default-page-header-logo" />
        </a>
      </router-link>
    </div>
    <div class="default-page-content">
      <router-link custom :to="{ name: backToPage.name }" v-slot="{ href, navigate }" v-if="backToPage.name">
        <a :href="href" @click.prevent="navigate()" class="default-page-back-link">
          <h2>🔙 To {{ backToPage.name.replace(/[A-Z]/g, (e) => ' ' + e) }}</h2>
        </a>
      </router-link>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from '@vue/runtime-core';
defineProps({
  backToPage: {
    type: Object,
    default: () => ({}),
  },
});
</script>
