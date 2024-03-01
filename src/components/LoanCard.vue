<template>
  <Card class="w-18rem m-2">
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
      <p class="m-0">Period: {{ props.bond.loanPeriod }} years</p>
      <div class="flex flex-row justify-content-between">
        <Button
          @click="openLoan()"
          icon="pi pi-folder-open"
          title="Open Loan"
          aria-label="Open Loan"
          class="h-2rem"
        />
        <ConfirmPopup></ConfirmPopup>
        <Button
          @click="confirmDelete($event)"
          icon="pi pi-trash"
          title="Open Loan"
          severity="danger"
          aria-label="Open Loan"
          class="h-2rem"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import deepCloneBond from "../assets/deepCloneBond.js"
import { basicLoanProps } from "../stores/loanStore"
import Card from "primevue/card"
import Button from "primevue/button"
import InputNumber from "primevue/inputnumber"
import ConfirmPopup from "primevue/confirmpopup"
import { useConfirm } from "primevue/useconfirm"
import { defineProps } from "vue"
import { useRouter } from "vue-router"
import { doc, deleteDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

const router = useRouter()
const confirm = useConfirm()

const props = defineProps({
  route: {
    type: String,
    default: "Basic",
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

function openLoan() {
  basicLoanProps.value = deepCloneBond(props)
  router.push({
    name: "Basic",
  })
}

const confirmDelete = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: "Do you want to delete this record?",
    icon: "pi pi-info-circle",
    rejectClass: "p-button-secondary p-button-outlined p-button-sm",
    acceptClass: "p-button-danger p-button-sm",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    accept: () => {
      deleteLoan()
    },
    reject: () => {},
  })
}

async function deleteLoan() {
  await deleteDoc(
    doc(db, "Users", auth.currentUser.uid, "Loans", props.bond.name)
  )
    .then(() => {
      console.log("Loan deleted from database.")
      router.go()
    })
    .catch((error) => {
      console.log("Error deleting loan from database:")
      console.log(error)
    })
}
</script>

<style></style>
