<template>
  <div style="display: flex; flex-direction: column;">
    <div style="display: flex; justify-content: space-around;">
      <div>
        <label for="loanAmount">Loan Amount: </label>
        <input id="loanAmount" type="text" v-model="loanAmount">
      </div>
      <div>
        <label for="interestRate">Interest Rate: </label>
        <input id="interestRate" type="number" v-model="interestRate">
      </div>
      <div>
        <label for="loanPeriod">Loan Period: </label>
        <input id="loanPeriod" type="number" v-model="loanPeriod">
      </div>
    </div>
    <div style="display: flex; justify-content: space-around;">
      <div>
        <label for="MinPayment">Min Monthly Payment: </label>
        <span>{{ minPayment }}</span>
      </div>
      <div>
        <label for="ActPayment">Actual Monthly Payment: </label>
        <input id="interestRate" type="number" :placeholder="minPayment" v-model="actualPayment">
      </div>
    </div>
    <div>
      <label for="LoanPayPeriod">Loan to be paid off in: </label>
      <span>30 years and 1 month</span>
    </div>
    <div>
      <label for="LastPayment">Last payment amount: </label>
      <span>$1000</span>
    </div>
    <div>
      <label for="TotalAmount">Total amount paid over period of load: </label>
      <span>$1000000</span>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed} from 'vue'

let loanAmount = ref(48000)

let interestRate = ref(1)

let loanPeriod = ref(5)

let actualPayment = ref()

let monthlyInterest = computed(() => {
  return interestRate.value/1200
})

let periodInMonths = computed(() => {
  return loanPeriod.value*12
})

let minPayment = computed(() => {
  return (loanAmount.value*monthlyInterest.value)/(1-1/((1+monthlyInterest.value)**periodInMonths.value))
})




  
</script>

<style scoped>


  
</style>