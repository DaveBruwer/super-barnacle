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
        <!-- <router-link
          class="p-2 bg-white h-4rem"
          v-if="item.route"
          :to="item.route"
        >
          <i :class="item.icon" /> {{ item.label }}
        </router-link> -->
        <!-- <router-link
          v-if="item.route"
          v-slot="routerProps"
          :to="item.route"
          custom
        >
          <a :href="item.route" v-bind="props.action">
            <span v-bind="props.icon" />
            <span v-bind="props.label">{{ label }}</span>
          </a>
        </router-link> -->
        <!-- <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span v-bind="props.icon" />
          <span v-bind="props.label">{{ label }}</span>
          <span
            :class="[
              hasSubmenu &&
                (root ? 'pi pi-fw pi-angle-down' : 'pi pi-fw pi-angle-right'),
            ]"
            v-bind="props.submenuicon"
          />
        </a> -->
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
  // {
  //   label: "Loan Simulators",
  //   icon: "pi pi-chart-line",
  //   items: [
  //     {
  //       label: "Basic Loan",
  //       icon: "pi pi-chart-line",
  //       route: "/Basic",
  //     },
  //     {
  //       label: "Home Loan",
  //       icon: "pi pi-home",
  //       route: "/HomeLoan",
  //     },
  //     {
  //       label: "Car Loan",
  //       icon: "pi pi-car",
  //       route: "/CarLoan",
  //     },
  //   ],
  // },
  // {
  //   label: "Cost of Ownership",
  //   icon: "pi pi-dollar",
  //   items: [
  //     {
  //       label: "Home",
  //       icon: "pi pi-home",
  //       route: "/HomeCost",
  //     },
  //     {
  //       label: "Car",
  //       icon: "pi pi-car",
  //       route: "/CarCost",
  //     },
  //   ],
  // },
  // {
  //   label: "Cashflow Calculators",
  //   icon: "pi pi-dollar",
  //   items: [
  //     {
  //       label: "Rental Property",
  //       icon: "pi pi-home",
  //       route: "/RentalProperty",
  //     },
  //     {
  //       label: "House Flip",
  //       icon: "pi pi-wrench",
  //       route: "/HouseFlip",
  //     },
  //     {
  //       label: "Property Development",
  //       icon: "pi pi-building",
  //       route: "/PropDev",
  //     },
  //   ],
  // },
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
