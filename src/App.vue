<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style>
.app-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}
</style>