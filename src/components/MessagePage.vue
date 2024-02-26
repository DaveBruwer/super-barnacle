<template>
  <div class="m-2 w-full flex justify-content-center align-items-center">
    <img alt="logo" src="/LoanSim_Logo1.svg" class="mr-2 w-full max-w-30rem" />
  </div>
  <Fieldset legend="Contact Form" class="m-2 w-full">
    <form
      @submit.prevent="submitMessage(messagePayload)"
      class="flex flex-column m-2 p-2 justify-content-center align-items-start gap-4"
    >
      <Message
        v-for="msg of infoMessages"
        :key="msg.content"
        :severity="msg.severity"
        class="w-full"
      >
        {{ msg.content }}
      </Message>
      <div class="flex flex-column gap-2">
        <label for="Name">Name</label>
        <InputText
          id="Name"
          type="text"
          v-model="v$.name.$model"
          placeholder="Name"
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
          placeholder="Please Select"
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
      <Button type="submit" :disabled="disableSubmit" label="Submit" />
    </form>
  </Fieldset>
</template>

<script setup>
import Fieldset from "primevue/fieldset"
import InputText from "primevue/inputtext"
import Button from "primevue/button"
import Message from "primevue/message"
import Dropdown from "primevue/dropdown"
import Textarea from "primevue/textarea"
import { reactive, ref, onMounted } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { required, email, minLength, maxLength } from "@vuelidate/validators"
import { authStore } from "../stores/authStore"

import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"
import { miscStore } from "../stores/miscStore"

const router = useRouter()

const messagePayload = reactive({
  name: "",
  email: "",
  title: "",
  type: "",
  message: "",
})

const messageTypes = ["General", "Bug / Issue", "Suggestion"]

const disableSubmit = ref(true)

const loginErrorMessage = ref("")

const infoMessages = ref([
  {
    content:
      "Use this form for general queries, to report bugs, or to make suggestions.",
    severity: "info",
  },
])

const rules = {
  name: { required, minLength: minLength(4), maxLength: maxLength(30) },
  email: { required, email },
  title: { required, minLength: minLength(4), maxLength: maxLength(30) },
  type: { required },
  message: { required, minLength: minLength(10) },
}

const v$ = useVuelidate(rules, messagePayload)

// .......................
onMounted(() => {
  if (authStore.user) {
    messagePayload.name = authStore.user.name
    messagePayload.email = authStore.user.email
  }
  disableSubmit.value = false
})

async function submitMessage(messagePayload) {
  infoMessages.value = []

  disableSubmit.value = true
  miscStore.progressSpinnerActive = true

  const isDataValid = await v$.value.$validate()

  if (isDataValid) {
    infoMessages.value = [
      {
        content: "Message sent successfully!",
        severity: "success",
      },
    ]
    // await signInWithEmailAndPassword(
    //   auth,
    //   messagePayload.email,
    //   messagePayload.password
    // ).catch((error) => {
    //   console.log("Error during user sign in:")
    //   console.log(error.code)
    //   if (error.code === "auth/invalid-credential") {
    //     loginErrorMessage.value = "Error! Wrong email or password."
    //   } else {
    //     loginErrorMessage.value = "An unexpected error occured!"
    //   }
    // })
    // // Navigate to /Account if user logged in.
    // if (auth.currentUser) {
    //   router.push("/Account")
    // }
  }

  disableSubmit.value = false
  miscStore.progressSpinnerActive = false
}
</script>
