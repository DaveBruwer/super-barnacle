<template>
  <h2 v-if="authStore.user">Welcome {{ authStore.user.displayName }}!</h2>
  <h2 v-else>Welcome Guest!</h2>
  <button @click="buttonClick">Press Me!</button>
</template>

<script setup>
import { authStore } from "../stores/authStore"
function buttonClick() {
  console.log(authStore)
}
</script>
