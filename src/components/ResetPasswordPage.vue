<template>
  <Fieldset legend="Reset Password" class="max-w-3rem m-2">
    <div>Submit your email address to recieve password reset instructions.</div>
    <form
      @submit="resetPassword(resetData)"
      class="flex flex-column m-4 justify-content-center align-items-center gap-4"
    >
      <div class="flex flex-column gap-2">
        <label for="Email">email</label>
        <InputText
          id="Email"
          type="text"
          v-model="v$.email.$model"
          placeholder="example@email.com"
          :class="{ 'p-invalid': v$.email.$errors.length }"
        />
        <small v-for="error of v$.email.$errors" :key="error.$uid">
          {{ error.$message }}
        </small>
      </div>
      <Message v-if="resetPasswordError" :closable="false" severity="error">{{
        resetPasswordError
      }}</Message>
      <Button
        type="submit"
        :disabled="disableSubmit"
        label="Submit"
        class="w-6"
        @click="resetPassword(resetData)"
      />
      <RouterLink to="/Login"><a>Sign in</a></RouterLink>
      <RouterLink to="/Register"><a>Register</a></RouterLink>
    </form>
  </Fieldset>
</template>

<script setup>
import Fieldset from "primevue/fieldset"
import InputText from "primevue/inputtext"
import Button from "primevue/button"
import Message from "primevue/message"
import { reactive, ref, onMounted } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { required, email } from "@vuelidate/validators"
import { RouterLink } from "vue-router"
import { auth } from "../firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import { miscStore } from "../stores/miscStore"

const resetData = reactive({
  email: "",
})

const disableSubmit = ref(true)

const resetPasswordError = ref("")

const rules = {
  email: { required, email },
}

const v$ = useVuelidate(rules, resetData)

// .......................
onMounted(() => {
  disableSubmit.value = false
})

async function resetPassword(resetData) {
  disableSubmit.value = true
  miscStore.progressSpinnerActive = true

  const isDataValid = await v$.value.$validate()

  if (isDataValid) {
    await sendPasswordResetEmail(auth, resetData.email)
      .then(() => {
        resetPasswordError.value = `A password reset email has been sent to ${resetData.email}`
      })
      .catch((error) => {
        console.log("Error:")
        console.log(error.code)
        if (error.code === "auth/invalid-credential") {
          resetPasswordError.value = `Error! ${resetData.email} is not associated with a LoanSim account.`
        } else {
          resetPasswordError.value = "An unexpected error occured!"
        }
      })
  }

  disableSubmit.value = false
  miscStore.progressSpinnerActive = false
}
</script>
