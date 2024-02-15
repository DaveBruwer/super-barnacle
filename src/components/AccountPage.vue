<template>
  <div
    v-if="authStore.user"
    class="m-2 flex flex-column justify-content-center align-items-center align-content-center"
  >
    <h2>Welcome {{ authStore.user.name }}!</h2>
    <Fieldset
      legend="Saved Loans"
      class="my-2 w-21rem flex flex-row justify-content-around"
      :toggleable="true"
    >
      <LoanCard />
      <LoanCard />
      <LoanCard />
    </Fieldset>
    <Fieldset
      legend="Accound Details"
      class="my-2 w-21rem"
      :toggleable="true"
      :collapsed="true"
    >
      <form
        @submit.prevent="updateUser(userData)"
        class="flex flex-column m-4 justify-content-center align-items-center gap-4"
      >
        <div class="flex flex-column gap-2">
          <label for="currencies" class="font-bold block">
            Default Currency:
          </label>
          <Dropdown
            v-model="v$.defaultCurrency.$model"
            :options="Object.values(currencies)"
            optionLabel="code"
            inputId="currencies"
            class="w-14rem"
          />
        </div>
        <div class="flex flex-column gap-2">
          <label for="Name">Name</label>
          <InputText
            id="Name"
            type="text"
            v-model="v$.name.$model"
            placeholder="Display Name"
            :class="{ 'p-invalid': v$.name.$errors.length }"
          />
          <small v-for="error of v$.name.$errors" :key="error.$uid">
            {{ error.$message }}
          </small>
        </div>
        <Button
          type="submit"
          :disabled="disableUpdate"
          label="Update"
          class="w-6"
        />
      </form>
    </Fieldset>
    <div class="flex justify-content-between">
      <Button icon="pi pi-sign-out" label="Sign Out" @click="signOutUser" />
      <Button
        icon="pi pi-key"
        label="Reset Password"
        @click="sendResetPasswordEmail"
        :disabled="disableResetPassword"
      />
    </div>
    <Message
      v-if="resetPasswordError"
      :closable="false"
      severity="error"
      :sticky="false"
      :life="3000"
      >{{ resetPasswordError }}</Message
    >
  </div>
  <div v-else>
    <h2>Welcome!</h2>
    <RouterLink to="/Login">
      <Button icon="pi pi-sign-in" label="Sign In" />
    </RouterLink>
  </div>
</template>

<script setup>
import LoanCard from "./LoanCard.vue"
import currencies from "../assets/currencies.json"
import InputText from "primevue/inputtext"
import Dropdown from "primevue/dropdown"
import Button from "primevue/button"
import Fieldset from "primevue/fieldset"
import Message from "primevue/message"
import { authStore } from "../stores/authStore"
import { reactive, ref, onMounted, watch } from "vue"
import { auth, db } from "../firebase"
import { doc, updateDoc } from "firebase/firestore"
import { signOut, updateProfile, sendPasswordResetEmail } from "firebase/auth"
import { useRouter } from "vue-router"
import { miscStore } from "../stores/miscStore"
import { useVuelidate } from "@vuelidate/core"
import { required, minLength, maxLength } from "@vuelidate/validators"

const router = useRouter()

const userData = reactive({
  defaultCurrency: {
    symbol: "$",
    name: "US Dollar",
    decimal_digits: 2,
    rounding: 0,
    code: "USD",
    name_plural: "US dollars",
  },
  name: "",
})

const disableUpdate = ref(false)

const rules = {
  defaultCurrency: { required },
  name: { required, minLength: minLength(4), maxLength: maxLength(30) },
}

const v$ = useVuelidate(rules, userData)

const signOutEnabled = ref(false)
const disableResetPassword = ref(false)
const resetPasswordError = ref("")

onMounted(async () => {
  watch(
    () => authStore.user,
    () => {
      if (authStore.user) {
        userData.name = authStore.user.name
        userData.defaultCurrency = authStore.user.defaultCurrency
      }
    },
    { immediate: true }
  )
  signOutEnabled.value = true
})

async function signOutUser() {
  signOutEnabled.value = false
  miscStore.progressSpinnerActive = true
  await signOut(auth)
    .then(() => {
      console.log("Sign Out Successful")
      router.push("/Login")
    })
    .catch((error) => {
      console.log("error signing out:")
      console.log(error)
      signOutEnabled.value = true
    })
}

async function updateUser(userData) {
  disableUpdate.value = true
  miscStore.progressSpinnerActive = true

  const isDataValid = await v$.value.$validate()

  if (isDataValid) {
    await updateProfile(auth.currentUser, {
      displayName: userData.name,
    })
      .then(() => {
        console.log("User auth profile updated.")
        updateDoc(doc(db, "Users", auth.currentUser.uid), {
          name: userData.name,
          defaultCurrency: userData.defaultCurrency,
        })
        console.log("User data updated in firestore.")
      })
      .then(() => {
        authStore.user.name = userData.name
        authStore.user.defaultCurrency = userData.defaultCurrency
        console.log("User data updated locally.")
      })
      .catch((error) => {
        console.log("Error during user Update:")
        console.log(error)
      })
  }
  disableUpdate.value = false
  miscStore.progressSpinnerActive = false
}

async function sendResetPasswordEmail() {
  disableResetPassword.value = true
  miscStore.progressSpinnerActive = true

  await sendPasswordResetEmail(auth, auth.currentUser.email)
    .then(() => {
      resetPasswordError.value = `A password reset email has been sent to ${auth.currentUser.email}`
    })
    .catch((error) => {
      console.log("Error:")
      console.log(error.code)
      if (error.code === "auth/invalid-credential") {
        resetPasswordError.value = `Error! ${auth.currentUser.email} is not associated with a LoanSim account.`
      } else {
        resetPasswordError.value = "An unexpected error occured!"
      }
    })

  miscStore.progressSpinnerActive = false
}
</script>
