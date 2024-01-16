<template>
  <div class="card relative z-2">
    <Menubar :model="items">
      <template #start>
        <router-link to="/">
          <img alt="logo" src="/SBicon.png" height="40" class="mr-2" />
        </router-link>
      </template>
      <template #item="{ label, item, props, root, hasSubmenu }">
        <router-link
          v-if="item.route"
          v-slot="routerProps"
          :to="item.route"
          custom
        >
          <a :href="routerProps.href" v-bind="props.action">
            <span v-bind="props.icon" />
            <span v-bind="props.label">{{ label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span v-bind="props.icon" />
          <span v-bind="props.label">{{ label }}</span>
          <span
            :class="[
              hasSubmenu &&
                (root ? 'pi pi-fw pi-angle-down' : 'pi pi-fw pi-angle-right'),
            ]"
            v-bind="props.submenuicon"
          />
        </a>
      </template>
      <template #end>
        <label for="themeSelector">Theme</label>
        <SelectButton
          id="themeSelector"
          v-model="currentTheme"
          :options="themeOptions"
          optionLabel="name"
          optionValue="value"
          aria-labelledby="basic"
        />
        <router-link to="Contact">
          <Button
            icon="pi pi-phone"
            severity="info"
            rounded
            aria-label="Contact"
            class="mx-2"
          />
        </router-link>
        <router-link to="Account">
          <Button icon="pi pi-user" severity="info" rounded aria-label="User" />
        </router-link>
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

const currentTheme = ref("auto")

const PrimeVue = usePrimeVue()

const themeOptions = ref([
  {
    name: "Auto",
    value: "auto",
  },
  {
    name: "Light",
    value: "saga-blue",
  },
  {
    name: "Dark",
    value: "vela-blue",
  },
])

const items = ref([
  {
    label: "Loan Calculators",
    icon: "pi pi-chart-line",
    items: [
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
    ],
  },
  {
    label: "Cost of Ownership",
    icon: "pi pi-dollar",
    items: [
      {
        label: "Home",
        icon: "pi pi-home",
        route: "/HomeCost",
      },
      {
        label: "Car",
        icon: "pi pi-car",
        route: "/CarCost",
      },
    ],
  },
  {
    label: "Cashflow Calculator",
    icon: "pi pi-dollar",
    items: [
      {
        label: "Rental Property",
        icon: "pi pi-home",
        route: "/RentalProperty",
      },
      {
        label: "House Flip",
        icon: "pi pi-wrench",
        route: "/HouseFlip",
      },
      {
        label: "Property Development",
        icon: "pi pi-building",
        route: "/PropDev",
      },
    ],
  },
])

let darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)")
darkThemeMq.addEventListener("change", autoChangeTheme)

function autoChangeTheme() {
  const isDarkTheme = darkThemeMq.matches
  console.log(isDarkTheme)
  console.log(currentTheme.value)
  if (currentTheme.value === "auto" && isDarkTheme) {
    PrimeVue.changeTheme("saga-blue", "vela-blue", "theme-link", () => {})
  } else if (currentTheme.value === "auto" && !isDarkTheme) {
    PrimeVue.changeTheme("vela-blue", "saga-blue", "theme-link", () => {})
  }
}

watch(
  () => currentTheme.value,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)
    if (newVal === "auto") {
      console.log("Auto theme")
      if (darkThemeMq.matches) {
        PrimeVue.changeTheme("saga-blue", "vela-blue", "theme-link", () => {})
      } else {
        PrimeVue.changeTheme("vela-blue", "saga-blue", "theme-link", () => {})
      }
    } else if (newVal === "vela-blue") {
      console.log("Dark Theme")
      PrimeVue.changeTheme("saga-blue", "vela-blue", "theme-link", () => {})
    } else if (newVal === "saga-blue") {
      console.log("Light theme")
      PrimeVue.changeTheme("vela-blue", "saga-blue", "theme-link", () => {})
    } else {
      console.log("Theme change not recognised: ", newVal)
    }
  },
  { immediate: true }
)
</script>

<style></style>
