<template>
  <v-app>
    <dHeader />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup>
import dHeader from './components/dHeader.vue'

</script>

<style scoped>

header {
  border-bottom: 2px solid #c0c5c1;
}


</style>
