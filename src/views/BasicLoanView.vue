<template>
  <div style="display: flex; flex-direction: column; padding: 1em;">
    <div style="display: flex; justify-content: space-around;">
      <div>
        <label for="loanAmount">Loan Amount: {{currency}}</label>
        <input id="loanAmount" type="number" v-model="loanAmount" style="width: 7em;">
      </div>
      <div>
        <label for="interestRate">Interest Rate: </label>
        <input id="interestRate" type="number" min="1" max="100" v-model="interestRate" style="width: 3em; text-align: end;">
        <span>%</span>
      </div>
      <div>
        <label for="loanPeriod">Loan Period: </label>
        <input id="loanPeriod" type="number" min="1" max="720" v-model="loanPeriod" style="width: 3em; text-align: end;">
        <span>Years</span>
      </div>
    </div>
    <div style="display: flex; justify-content: space-around;">
      <div>
        <label for="MinPayment">Min Monthly Payment: {{currency}}</label>
        <span>{{ minPayment }}</span>
      </div>
      <div>
        <label for="ActPayment">Actual Monthly Payment: {{currency}}</label>
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

const currency = ref("$")

const currencyFormatter = new Intl.NumberFormat('en-US')

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
  const minPayment_ = (loanAmount.value*monthlyInterest.value)/(1-1/((1+monthlyInterest.value)**periodInMonths.value))
  return currencyFormatter.format(minPayment_)
})



  
</script>

<style scoped>


  
</style>