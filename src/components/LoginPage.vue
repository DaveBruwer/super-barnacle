<template>
  <Fieldset legend="Login" class="m-2">
    <form
      @submit="logInUser(loginData)"
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
      <Button
        :disabled="disableSubmit"
        label="Submit"
        class="w-6"
        @click="logInUser(loginData)"
      />
      <RouterLink to="/Register"><a>Register</a></RouterLink>
    </form>
  </Fieldset>
</template>

<script setup>
import Fieldset from "primevue/fieldset"
import InputText from "primevue/inputtext"
import Password from "primevue/password"
import Button from "primevue/button"
import { reactive, ref } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { required, email } from "@vuelidate/validators"
import { RouterLink } from "vue-router"

const loginData = reactive({
  email: "",
  password: "",
})

const disableSubmit = ref(false)

const rules = {
  email: { required, email },
  password: { required },
}

const v$ = useVuelidate(rules, loginData)

async function logInUser() {
  disableSubmit.value = true

  const isDataValid = await this.v$.$validate()
  console.log(isDataValid)

  disableSubmit.value = false
}
</script>
