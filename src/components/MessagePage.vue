<template>
  <Fieldset legend="Contact Form" class="m-2 w-full">
    <form
      @submit.prevent="submitMessage(messagePayload)"
      class="flex flex-column m-2 p-2 justify-content-center align-items-start gap-4"
    >
      <Message :closable="false"
        >Use this form for general queries, to report bugs, or to make
        suggestions.
      </Message>
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
        <label for="Title">Message Title</label>
        <InputText
          id="Title"
          type="text"
          v-model="v$.title.$model"
          placeholder="Message Title"
          :class="{ 'p-invalid': v$.title.$errors.length }"
        />
        <small v-for="error of v$.title.$errors" :key="error.$uid">
          {{ error.$message }}
        </small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="Type">Message Type</label>
        <Dropdown
          id="Type"
          v-model="v$.type.$model"
          :options="messageTypes"
          placeholder="Type of message"
          :class="{ 'p-invalid': v$.type.$errors.length }"
        />
        <small v-for="error of v$.title.$errors" :key="error.$uid">
          {{ error.$message }}
        </small>
      </div>
      <div class="flex flex-column gap-2 w-full">
        <label for="Message">Message</label>
        <Textarea
          autoResize
          id="Message"
          v-model="v$.message.$model"
          placeholder="Type your message here."
          :class="{ 'p-invalid': v$.message.$errors.length }"
        />
        <small v-for="error of v$.message.$errors" :key="error.$uid">
          {{ error.$message }}
        </small>
      </div>
      <Message v-if="loginErrorMessage" :closable="false" severity="error">{{
        loginErrorMessage
      }}</Message>
      <Button
        type="submit"
        :disabled="disableSubmit"
        label="Submit"
        class="w-2"
      />
    </form>
  </Fieldset>
</template>

<script setup>
import Fieldset from "primevue/fieldset"
import InputText from "primevue/inputtext"
import Button from "primevue/button"
import Message from "primevue/message"
import Dropdown from "primevue/dropdown"
import { reactive, ref, onMounted } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { required, email } from "@vuelidate/validators"
import Textarea from "primevue/textarea"
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"
import { miscStore } from "../stores/miscStore"

const router = useRouter()

const messagePayload = reactive({
  email: "",
  title: "",
  type: "",
  message: "",
})

const messageTypes = ["General", "Bug / Issue", "Suggestion"]

const disableSubmit = ref(true)

const loginErrorMessage = ref("")

const rules = {
  email: { required, email },
  title: { required },
  type: { required },
  message: { required },
}

const v$ = useVuelidate(rules, messagePayload)

// .......................
onMounted(() => {
  disableSubmit.value = false
})

async function submitMessage(messagePayload) {
  console.log("submitMessage")

  // disableSubmit.value = true
  // miscStore.progressSpinnerActive = true

  // const isDataValid = await v$.value.$validate()

  // if (isDataValid) {
  //   await signInWithEmailAndPassword(
  //     auth,
  //     messagePayload.email,
  //     messagePayload.password
  //   ).catch((error) => {
  //     console.log("Error during user sign in:")
  //     console.log(error.code)
  //     if (error.code === "auth/invalid-credential") {
  //       loginErrorMessage.value = "Error! Wrong email or password."
  //     } else {
  //       loginErrorMessage.value = "An unexpected error occured!"
  //     }
  //   })
  //   // Navigate to /Account if user logged in.
  //   if (auth.currentUser) {
  //     router.push("/Account")
  //   }
  // }

  // disableSubmit.value = false
  // miscStore.progressSpinnerActive = false
}
</script>
