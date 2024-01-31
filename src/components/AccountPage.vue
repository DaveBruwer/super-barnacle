<template>
  <div v-if="authStore.user">
    <h2>Welcome {{ authStore.user.displayName }}!</h2>
    <Button icon="pi pi-sign-out" label="Sign Out" @click="signOutUser" />
  </div>
  <div v-else>
    <h2>Welcome!</h2>
    <RouterLink to="/Login">
      <Button icon="pi pi-sign-in" label="Sign In" @click="signOutUser" />
    </RouterLink>
  </div>
</template>

<script setup>
import Button from "primevue/button"
import { authStore } from "../stores/authStore"
import { ref, onMounted } from "vue"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "vue-router"

const router = useRouter()

const signOutEnabled = ref(false)

onMounted(() => {
  if (!authStore.user) {
    router.push("/Login")
  }
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
