<template>
  <Fieldset legend="Register" class="m-2">
    <form
      @submit="registerNewUser(registrationData)"
      class="flex flex-column m-4 justify-content-center align-items-center gap-4"
    >
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
          v-model="v$.password.$model"
          placeholder="Password"
          :class="{ 'p-invalid': v$.password.$errors.length }"
        />
        <small v-for="error of v$.password.$errors" :key="error.$uid">
          {{ error.$message }}
        </small>
      </div>
      <div class="flex flex-column gap-2">
        <Password
          id="Confirmpassword"
          :feedback="false"
          v-model="v$.confirmPass.$model"
          placeholder="Confirm Password"
          :class="{ 'p-invalid': v$.confirmPass.$errors.length }"
        />
        <small v-for="error of v$.confirmPass.$errors" :key="error.$uid">
          {{ error.$message }}
        </small>
      </div>

      <Button
        :disabled="disableSubmit"
        label="Submit"
        class="w-6"
        @click="registerNewUser(registrationData)"
      />
      <RouterLink to="/Login"><a>Log in</a></RouterLink>
    </form>
  </Fieldset>

  <dialog ref="progressSpinnerModal" class="w-auto h-auto border-none">
    <div
      class="flex justify-content-center align-itmes-center align-content-center w-full h-full"
    >
      <ProgressSpinner class="h-auto" />
    </div>
  </dialog>
</template>

<script setup>
import Fieldset from "primevue/fieldset"
import InputText from "primevue/inputtext"
import Password from "primevue/password"
import Button from "primevue/button"
import ProgressSpinner from "primevue/progressspinner"
import { reactive, ref, computed, onMounted } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { required, email, sameAs, minLength } from "@vuelidate/validators"
import { RouterLink } from "vue-router"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useRouter } from "vue-router"
import { authStore } from "../stores/authStore"

const router = useRouter()

const progressSpinnerModal = ref(null)

const registrationData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPass: "",
})

const disableSubmit = ref(true)

const rules = {
  name: { required },
  email: { required, email },
  password: { required, minLength: minLength(8) },
  confirmPass: {
    required,
    sameAsPassword: sameAs(computed(() => registrationData.password)),
  },
}

const v$ = useVuelidate(rules, registrationData)

// .......................
onMounted(() => {
  disableSubmit.value = false
})

async function registerNewUser(registrationData) {
  disableSubmit.value = true
  progressSpinnerModal.value.showModal()

  const isDataValid = await this.v$.$validate()

  if (isDataValid) {
    await createUserWithEmailAndPassword(
      auth,
      registrationData.email,
      registrationData.password
    )
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: registrationData.name,
        })
      })
      .then(() => {
        console.log(auth.currentUser)
      })
      .catch((error) => {
        console.log("Error during registration:")
        console.log(error)
      })
    // Navigate to /Account if user logged in.
    if (auth.currentUser) {
      authStore.user = auth.currentUser

      console.log(authStore.user)

      router.push("/Account")
    }
  }

  disableSubmit.value = false
  progressSpinnerModal.value.close()
}
</script>

<style>
dialog {
  background-color: transparent;
}

dialog::backdrop {
  background-color: black;
  opacity: 0.5;
}
</style>
