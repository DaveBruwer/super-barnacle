<template>
  <form
    class="flex flex-column m-4 justify-content-center align-items-center gap-4"
  >
    <InputText
      type="text"
      v-model="registrationData.firstName"
      placeholder="First Name"
    />
    <InputText
      type="text"
      v-model="registrationData.lastName"
      placeholder="Last Name"
    />
    <InputText
      type="text"
      v-model="registrationData.email"
      placeholder="email"
    />
    <Password
      v-model="registrationData.password"
      :feedback="false"
      placeholder="Password"
    />
    <Password
      v-model="registrationData.confirmPass"
      :feedback="false"
      placeholder="Confirm Password"
    />
    <Button label="Submit" class="w-6" />
  </form>
</template>

<script setup>
import InputText from "primevue/inputtext"
import Password from "primevue/password"
import Button from "primevue/button"
import { reactive } from "vue"

const registrationData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPass: "",
})
</script>

<style></style>
