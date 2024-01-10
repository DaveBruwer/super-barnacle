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
        <Button
          icon="pi pi-phone"
          severity="info"
          rounded
          aria-label="Contact"
          class="mx-2"
        />
        <Button icon="pi pi-user" severity="info" rounded aria-label="User" />
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from "vue"
import Menubar from "primevue/menubar"
import Button from "primevue/button"

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
      },
      {
        label: "Car Loan",
        icon: "pi pi-car",
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
      },
      {
        label: "Car",
        icon: "pi pi-car",
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
      },
      {
        label: "House Flip",
        icon: "pi pi-wrench",
      },
      {
        label: "Property Development",
        icon: "pi pi-building",
      },
    ],
  },
])
</script>
