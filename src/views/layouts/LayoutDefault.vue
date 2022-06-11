<template>
  <div class="default">
    <div class="default-content">
      <router-view></router-view>
    </div>
    <DefaultFooter> </DefaultFooter>
  </div>
</template>

<script setup>
import DefaultFooter from './DefaultFooter.vue';
</script>
