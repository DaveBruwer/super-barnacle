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
        type="submit"
        :disabled="disableSubmit"
        label="Submit"
        class="w-6"
        @click="registerNewUser(registrationData)"
      />
      <RouterLink to="/Login"><a>Sign in</a></RouterLink>
    </form>
  </Fieldset>
</template>

<script setup>
import Fieldset from "primevue/fieldset"
import InputText from "primevue/inputtext"
import Password from "primevue/password"
import Button from "primevue/button"
import { reactive, ref, computed, onMounted } from "vue"
import { useVuelidate } from "@vuelidate/core"
import {
  required,
  email,
  sameAs,
  minLength,
  maxLength,
} from "@vuelidate/validators"
import { RouterLink } from "vue-router"
import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "vue-router"
import { miscStore } from "../stores/miscStore"

const router = useRouter()

const registrationData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPass: "",
})

const disableSubmit = ref(true)

const rules = {
  name: { required, minLength: minLength(4), maxLength: maxLength(30) },
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
  miscStore.progressSpinnerActive = true

  const isDataValid = await v$.value.$validate()

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
      .then(async () => {
        await setDoc(doc(db, "Users", auth.currentUser.uid), {
          name: registrationData.name,
          email: registrationData.email,
          profilePhoto: auth.currentUser.photoURL,
          defaultCurrency: {
            symbol: "$",
            name: "US Dollar",
            decimal_digits: 2,
            rounding: 0,
            code: "USD",
            name_plural: "US dollars",
          },
        })
      })
      .catch((error) => {
        console.log("Error during registration:")
        console.log(error)
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

<style></style>
