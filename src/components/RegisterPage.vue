<template>
  <Fieldset legend="Register" class="m-2">
    <form
      @submit="registerNewUser(registrationData)"
      class="flex flex-column m-4 justify-content-center align-items-center gap-4"
    >
      <div class="flex flex-column gap-2">
        <label for="Firstname">First Name</label>
        <InputText
          id="Firstname"
          type="text"
          v-model="v$.firstName.$model"
          placeholder="First Name"
          :class="{ 'p-invalid': v$.firstName.$errors.length }"
        />
        <small v-for="error of v$.firstName.$errors" :key="error.$uid">
          {{ error.$message }}
        </small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="Lastname">Last Name</label>
        <InputText
          id="Lastname"
          type="text"
          v-model="v$.lastName.$model"
          placeholder="Last Name"
          :class="{ 'p-invalid': v$.lastName.$errors.length }"
        />
        <small v-for="error of v$.lastName.$errors" :key="error.$uid">
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
</template>

<script setup>
import Fieldset from "primevue/fieldset"
import InputText from "primevue/inputtext"
import Password from "primevue/password"
import Button from "primevue/button"
import { reactive, ref } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { required, email, sameAs, minLength } from "@vuelidate/validators"
import { RouterLink } from "vue-router"

const registrationData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPass: "",
})

const disableSubmit = ref(false)

const rules = {
  firstName: { required },
  lastName: { required },
  email: { required, email },
  password: { required, minLength: minLength(8) },
  confirmPass: { required, sameAsPassword: sameAs(registrationData.password) },
}

const v$ = useVuelidate(rules, registrationData)

async function registerNewUser() {
  disableSubmit.value = true

  const isDataValid = await this.v$.$validate()
  console.log(isDataValid)

  disableSubmit.value = false
}
</script>
