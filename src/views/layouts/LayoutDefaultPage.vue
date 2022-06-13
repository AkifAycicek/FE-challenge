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
      <router-view />
    </div>
  </div>
</template>

<script setup></script>
