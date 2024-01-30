<template>
  <h2 v-if="authStore.user">Welcome {{ authStore.user.displayName }}!</h2>
  <h2 v-else>Welcome Guest!</h2>
  <Button icon="pi pi-sign-out" label="Sign Out" @click="signOutUser" />
</template>

<script setup>
import Button from "primevue/button"
import { authStore } from "../stores/authStore"
import { ref, onMounted } from "vue"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"

const signOutEnabled = ref(false)

onMounted(() => {
  signOutEnabled.value = true
})

async function signOutUser() {
  await signOut(auth)
    .then(() => {
      console.log("Sign Out Successful")
    })
    .catch((error) => {
      console.log("error signing out:")
      console.log(error)
    })
}
</script>
