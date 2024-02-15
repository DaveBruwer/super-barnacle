<template>
  <Card class="w-21rem">
    <template #title>
      <i :class="props.icon" style="font-size: 2rem" />
      {{ props.bond.name }}</template
    >
    <template #content>
      <p class="m-0">
        Loan Amount:
        <InputNumber
          :input-class="blendedInput"
          v-model.lazy="props.bond.loanAmount"
          mode="currency"
          :currency="props.bond.currency.code"
          locale="en-US"
          disabled
        />
      </p>
      <p class="my-2">Interest Rate: {{ props.bond.interestRate }}%</p>
      <p class="m-0">Period {{ props.bond.loanPeriod }} years</p>
    </template>
  </Card>
</template>

<script setup>
import Card from "primevue/card"
import InputNumber from "primevue/inputnumber"
import { defineProps } from "vue"

const props = defineProps({
  route: {
    type: String,
    default: "/Basic",
  },
  icon: {
    type: String,
    default: "pi pi-chart-line",
  },
  saved: {
    type: Boolean,
    default: true,
  },
  bond: {
    type: Object,
    default() {
      return {
        name: "Basic Loan",
        currency: {
          symbol: "$",
          name: "US Dollar",
          decimal_digits: 2,
          rounding: 0,
          code: "USD",
          name_plural: "US dollars",
        },
        loanAmount: 500000,
        interestRate: 7,
        loanPeriod: 30,
        actualPayment: 3326.51,
        customPayment: false,
        startingDate: new Date(),
        adHocPayments: Array.from({ length: 60 * 12 + 1 }, () => 0),
        customPayments: Array.from({ length: 60 * 12 + 1 }, () => 0),
        adHocInterest: Array.from({ length: 60 * 12 + 1 }, () => null),
        adHocMonthlyPayments: Array.from({ length: 60 * 12 + 1 }, () => null),
      }
    },
  },
})

// CLASSES

const blendedInput = "w-8rem opacity-100 bg-transparent border-transparent"
const boldBlendedInput = blendedInput + " font-bold"
</script>

<style></style>
