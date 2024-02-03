<template>
  <Fieldset legend="Sign In" class="m-2">
    <form
      @submit="logInNewUser(loginData)"
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
      <div class="flex flex-column gap-2">
        <label for="Password">Pasword</label>
        <Password
          id="Password"
          :feedback="false"
          v-model="v$.password.$model"
          placeholder="Password"
          :class="{ 'p-invalid': v$.password.$errors.length }"
        />
        <small v-for="error of v$.password.$errors" :key="error.$uid">
          {{ error.$message }}
        </small>
      </div>
      <Message v-if="loginErrorMessage" :closable="false" severity="error">{{
        loginErrorMessage
      }}</Message>
      <Button
        :disabled="disableSubmit"
        label="Submit"
        class="w-6"
        @click="logInNewUser(loginData)"
      />
      <RouterLink to="/Register"><a>Register</a></RouterLink>
      <RouterLink to="/ResetPassword"><a>Forgot Password</a></RouterLink>
    </form>
  </Fieldset>
</template>

<script setup>
import Fieldset from "primevue/fieldset"
import InputText from "primevue/inputtext"
import Password from "primevue/password"
import Button from "primevue/button"
import Message from "primevue/message"
import { reactive, ref, onMounted } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { required, email } from "@vuelidate/validators"
import { RouterLink } from "vue-router"
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"
import { miscStore } from "../stores/miscStore"

const router = useRouter()

const loginData = reactive({
  email: "",
  password: "",
})

const disableSubmit = ref(true)

const loginErrorMessage = ref("")

const rules = {
  email: { required, email },
  password: { required },
}

const v$ = useVuelidate(rules, loginData)

// .......................
onMounted(() => {
  disableSubmit.value = false
})

async function logInNewUser(loginData) {
  disableSubmit.value = true
  miscStore.progressSpinnerActive = true

  const isDataValid = await v$.value.$validate()

  if (isDataValid) {
    await signInWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password
    ).catch((error) => {
      console.log("Error during user sign in:")
      console.log(error.code)
      if (error.code === "auth/invalid-credential") {
        loginErrorMessage.value = "Error! Wrong email or password."
      } else {
        loginErrorMessage.value = "An unexpected error occured!"
      }
    })
    // Navigate to /Account if user logged in.
    if (auth.currentUser) {
      router.push("/Account")
    }
  }

  disableSubmit.value = false
  miscStore.progressSpinnerActive = false
}
</script>
