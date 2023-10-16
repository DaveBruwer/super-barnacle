<template>
  <v-app :theme="darkMode ? 'dark' : 'light'">
    <v-app-bar title="Super Barnacle">
      <v-switch v-model="darkMode" label="Dark Mode"></v-switch>
    </v-app-bar>
    <v-main>V Main Content</v-main>
  </v-app>  
</template>

<script setup>
import {ref} from 'vue'

const theme = ref('dark')

const darkMode = ref(true)

console.log(darkMode.value)
  
</script>

<style>
  
</style>