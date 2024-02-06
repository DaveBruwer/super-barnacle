<template>
  <div v-if="authStore.user">
    <h2>Welcome {{ authStore.user.name }}!</h2>
    <Fieldset legend="Accound Details">
      <form
        @submit="registerNewUser(userData)"
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
      </form>
    </Fieldset>
    <Button icon="pi pi-sign-out" label="Sign Out" @click="signOutUser" />
    <Button
      icon="pi pi-sign-out"
      label="Press Me!"
      @click="() => console.log(authStore)"
    />
  </div>
  <div v-else>
    <h2>Welcome!</h2>
    <RouterLink to="/Login">
      <Button icon="pi pi-sign-in" label="Sign In" @click="signOutUser" />
    </RouterLink>
  </div>
</template>

<script setup>
import currencies from "../assets/currencies.json"
import InputText from "primevue/inputtext"
import Dropdown from "primevue/dropdown"
import Button from "primevue/button"
import Fieldset from "primevue/fieldset"
import { authStore } from "../stores/authStore"
import { reactive, ref, onMounted } from "vue"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
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

const updateEnabled = ref(true)

const rules = {
  defaultCurrency: { required },
  name: { required, minLength: minLength(4), maxLength: maxLength(30) },
}

const v$ = useVuelidate(rules, userData)

const signOutEnabled = ref(false)

onMounted(async () => {
  await auth.authStateReady().then(() => {
    if (authStore.user) {
      userData.name = authStore.user.name
      userData.defaultCurrency = authStore.user.defaultCurrency
    }
    signOutEnabled.value = true
  })
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
</script>
