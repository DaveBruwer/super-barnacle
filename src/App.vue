<template>
  <div class="flex flex-column align-items-center">
    <dHeader />
    <div style="max-width: 60rem">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import dHeader from "./components/dHeader.vue"
</script>

<style scoped></style>
