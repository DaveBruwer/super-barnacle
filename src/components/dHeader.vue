<template>
  <div class="w-full card relative z-2">
    <Menubar :model="items">
      <template #start>
        <router-link class="p-menuitem" to="/">
          <img alt="logo" src="/LoanSim_Icon3.svg" height="40" class="mr-2" />
        </router-link>
      </template>
      <template #item="{ label, item, props, root, hasSubmenu }">
        <router-link :to="item.route">
          <Button :icon="item.icon" severity="info" class="mx-2" />
        </router-link>
      </template>
      <template #end>
        <div class="flex justify-content-between">
          <SelectButton
            id="themeSelector"
            v-model="miscStore.currentTheme"
            :options="themeOptions"
            optionValue="value"
            aria-labelledby="basic"
          >
            <template #option="slotProps">
              <i :class="slotProps.option.icon"></i>
            </template>
          </SelectButton>
          <router-link to="Contact">
            <Button
              icon="pi pi-comments"
              severity="info"
              rounded
              aria-label="Contact"
              class="mx-2"
            />
          </router-link>
          <router-link to="Account">
            <Button
              icon="pi pi-user"
              severity="info"
              rounded
              aria-label="User"
            />
          </router-link>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import Menubar from "primevue/menubar"
import Button from "primevue/button"
import SelectButton from "primevue/selectbutton"
import { usePrimeVue } from "primevue/config"
import { miscStore } from "../stores/miscStore"
import { auth, db } from "../firebase"
import { doc, updateDoc } from "firebase/firestore"
import { authStore } from "../stores/authStore"

const PrimeVue = usePrimeVue()

const themeOptions = ref([
  {
    icon: "pi pi-sun",
    value: "saga-blue",
  },
  {
    icon: "pi pi-moon",
    value: "vela-blue",
  },
])

const items = ref([
  {
    label: "Basic Loan",
    icon: "pi pi-chart-line",
    route: "/Basic",
  },
  {
    label: "Home Loan",
    icon: "pi pi-home",
    route: "/HomeLoan",
  },
  {
    label: "Car Loan",
    icon: "pi pi-car",
    route: "/CarLoan",
  },
])

watch(
  () => miscStore.currentTheme,
  async (newVal) => {
    if (authStore.user && newVal != authStore.user.theme) {
      authStore.user.theme = newVal
      updateDoc(doc(db, "Users", auth.currentUser.uid), {
        theme: newVal,
      })
        .then(() => {
          console.log("User theme updated.")
        })
        .catch((error) => {
          console.log("Error during user Update:")
          console.log(error)
        })
    }
    if (newVal === "vela-blue") {
      PrimeVue.changeTheme("saga-blue", "vela-blue", "theme-link", () => {})
    } else if (newVal === "saga-blue") {
      PrimeVue.changeTheme("vela-blue", "saga-blue", "theme-link", () => {})
    } else {
      console.log("Theme change not recognised: ", newVal)
    }
  },
  { immediate: true }
)
</script>

<style>
a {
  text-decoration: none;
}
</style>
