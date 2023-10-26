<template>
  <div class="card flex flex-wrap gap-3 p-fluid">
    <div class="flex-auto">
        <label for="currencies" class="font-bold block mb-2"> Currency: </label>
        <Dropdown v-model.lazy="bondStore.currency" :options="Object.values(currencies)" optionLabel="code" inputId="currencies" class="w-full md:w-14rem" />
    </div>
    <div class="flex-auto">
        <label for="loan-amount" class="font-bold block mb-2"> Loan Amount: </label>
        <InputNumber v-model.lazy="bondStore.loanAmount" inputId="loan-amount" mode="currency" :currency="bondStore.currency.code" locale="en-US" />
    </div>
    <div class="flex-auto">
        <label for="interestRate" class="font-bold block mb-2"> Interest Rate: </label>
        <InputNumber v-model.lazy="bondStore.interestRate" mode="decimal" :minFractionDigits="2" :min="0"  inputId="interestRate" suffix="%" showButtons/>
    </div>
    <div class="flex-auto">
        <label for="loanPeriod" class="font-bold block mb-2"> Loan Period: </label>
        <InputNumber v-model.lazy="bondStore.loanPeriod" mode="decimal" :minFractionDigits="0"  inputId="loanPeriod" suffix=" Yrs" />
    </div>
    <div class="font-bold block mb-2">
     Minimum monthly payments:
      <InputNumber v-model.lazy="bondStore.minPayment" mode="currency" :currency="bondStore.currency.code" locale="en-US" disabled />
    </div>
    <div class="flex-auto">
      <label for="actualPayment" class="font-bold block mb-2">Monthly Payment Amount: {{bondStore.customPayments ? '' : ' (min)'}}</label>
      <InputNumber class="p-inputnumber-button" v-model.lazy="bondStore.actualPayment" @input="actualPaymentInput" inputId="actualPayment" mode="currency" :currency="bondStore.currency.code" locale="en-US" :min="bondStore.minPayment" />
    </div>
    <div class="flex-auto">
      <label for="startDate" class="font-bold block mb-2"> First Payment Month: </label>
      <Calendar v-model.lazy="bondStore.startingDate" view="month" dateFormat="MM yy" showIcon />
    </div>
    <div class="font-bold block mb-2"> Loan will be paid off in: {{bondStore.duration}} </div>
    <div class="font-bold block mb-2">
      Last payment amount will be:
      <InputNumber v-model.lazy="bondStore.finalPayment" mode="currency" :currency="bondStore.currency.code" locale="en-US" disabled />
    </div>
    <div class="font-bold block mb-2">
      Total amount paid over the period of the loan:
      <InputNumber v-model.lazy="bondStore.totalContribution" mode="currency" :currency="bondStore.currency.code" locale="en-US" disabled />
    </div>
  </div>
  <Button label="Button" icon="pi pi-circle" @click="buttonPress" />
  
  <div style="width: 50em;">
    <PrimeChart style="margin: 1em;" :chart-data="chartData"/>
  </div>
  <!-- _____________________________________________________________________________________________________________ -->
  <div>
    <button @click="adHocPaymentsDialog.showModal()"> Ad-Hoc Payments</button>
    <dialog ref="adHocPaymentsDialog">
      <table >
        <thead>
          <tr>
            <th colspan="13">AD HOC PAYMENTS</th>
          </tr>
          <tr>
            <th colspan="13">Enter any additional payments which you make into your bond account. Loans from it are entered as negative numbers.</th>
          </tr>
          <tr>
            <th></th>
            <th v-for="n in 12" :key="n">{{n}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in bondStore.finalYear + 1" :key="m">
            <td>{{ bondStore.dates[0].getFullYear() + m-1 }}</td>
            <td v-for="i in 12" :key="i">
              <input v-if="(m < 2 && i < bondStore.dates[0].getMonth()+1) || (m == bondStore.finalYear + 1 && i > bondStore.dates[bondStore.finalYear*12].getMonth())" type="number" disabled="true" style="width: 5em;">
              <input v-else type="number" v-model.lazy="bondStore.adHocPayments[(m-1)*12 + i - bondStore.dates[0].getMonth()]" placeholder="0" style="width: 5em;">
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="adHocPaymentsDialog.close()">Close</button>
    </dialog>
    <button @click="interestRatesDialog.showModal()"> Interest Rates</button>
    <dialog ref="interestRatesDialog">
      <table>
        <thead>
          <tr>
            <th colspan="13">INTEREST RATES</th>
          </tr>
          <tr>
            <th colspan="13">Fill in the new interest rate in the month in which it changes.</th>
          </tr>
          <tr>
            <th></th>
            <th colspan="12">Months</th>
          </tr>
          <tr>
            <th>Years</th>
            <th v-for="n in 12" :key="n">{{n}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in bondStore.finalYear + 1" :key="m">
            <td>{{ bondStore.dates[0].getFullYear() + m-1 }}</td>
            <td v-for="i in 12" :key="i">
              <input v-if="(m < 2 && i < bondStore.dates[0].getMonth()+1) || (m == bondStore.finalYear + 1 && i > bondStore.dates[bondStore.finalYear*12].getMonth())" type="number" disabled="true" style="width: 5em;">
              <input v-else type="number" v-model.lazy="bondStore.adHocInterest[(m-1)*12 + i]" :placeholder="bondStore.runningCalcs[(m-1)*12 + i - bondStore.dates[0].getMonth()].annualInterest" style="width: 5em;">
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="interestRatesDialog.close()">Close</button>
    </dialog>
    <button @click="bondPaymentsDialog.showModal()"> Bond Repayments</button>
    <dialog ref="bondPaymentsDialog">
      <table>
        <thead>
          <tr>
            <th colspan="13">BOND REPAYMENTS</th>
          </tr>
          <tr>
            <th colspan="13">Fill in the new bond repayment amount in the month in which it changes.</th>
          </tr>
          <tr>
            <th></th>
            <th colspan="12">Months</th>
          </tr>
          <tr>
            <th>Years</th>
            <th v-for="n in 12" :key="n">{{n}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in bondStore.finalYear + 1" :key="m">
            <td>{{ bondStore.dates[0].getFullYear() + m-1 }}</td>
            <td v-for="i in 12" :key="i">
              <input v-if="(m < 2 && i < bondStore.dates[0].getMonth()+1) || (m == bondStore.finalYear + 1 && i > bondStore.dates[bondStore.finalYear*12].getMonth())" type="number" disabled="true" style="width: 5em;">
              <input v-else type="number" v-model.lazy="bondStore.adHocMonthlyPayments[(m-1)*12 + i]" :placeholder="bondStore.runningCalcs[(m-1)*12 + i - bondStore.dates[0].getMonth()].payment" style="width: 5em;">
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="bondPaymentsDialog.close()">Close</button>
    </dialog>
    <button @click="runningCapitalDialog.showModal()"> Running Capital</button>
    <dialog ref="runningCapitalDialog">
      <table>
        <thead>
          <tr>
            <th colspan="13">RUNNING CAPITAL</th>
          </tr>
          <tr>
            <th colspan="13">Figures represent the remaining capital at the end of each month.</th>
          </tr>
          <tr>
            <th></th>
            <th colspan="12">Months</th>
          </tr>
          <tr>
            <th>Years</th>
            <th v-for="n in 12" :key="n">{{n}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in bondStore.finalYear + 1" :key="m">
            <td>{{ bondStore.dates[0].getFullYear() + m -1 }}</td>
            <td v-for="i in 12" :key="i">
              <div v-if="(m < 2 && i < bondStore.dates[0].getMonth()+1) || (m == bondStore.finalYear + 1 && i > bondStore.dates[bondStore.finalYear*12].getMonth())" style="width: 7em; text-align: center;">-</div>
              <div v-else style="width: 7em;">{{bondStore.currency.symbol}}{{ currencyFormatter.format(bondStore.runningCalcs[(m-1)*12 + i - bondStore.dates[0].getMonth()].capital) }}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="runningCapitalDialog.close()">Close</button>
    </dialog>
  </div>
</template>

<script setup>
import {ref, reactive, watchEffect} from "vue"
import { bondStore, dateToMonth } from "../Stores/bond"
import currencies from "../assets/currencies.json"
import PrimeChart from "../components/PrimeChart.vue"

// PrimeVue imports...
import InputNumber from "primevue/inputnumber"
import Button from "primevue/button"
import Dropdown from "primevue/dropdown"
import Calendar from "primevue/calendar"

const currencyFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const adHocPaymentsDialog = ref()
const interestRatesDialog = ref()
const bondPaymentsDialog = ref()
const runningCapitalDialog = ref()

const chartData = reactive({
  labels: Array.from({length: bondStore.finalYear * 12}, (x, i) => i),
  datasets: [
    {
      label: "Loan Capital",
      data: Array.from({length: bondStore.loanPeriod * 12}, () => bondStore.loanAmount),
    }
  ]
})

const parseCalcs = () => {
  bondStore.totalContribution = 0
  bondStore.runningCalcs.forEach((x, i) => {
    // interest calcs
    if (bondStore.adHocInterest[i]) {
      bondStore.runningCalcs[i].annualInterest = bondStore.adHocInterest[i]
    } else if (i == 0) {
      bondStore.runningCalcs[i].annualInterest = bondStore.interestRate
    } else {
      bondStore.runningCalcs[i].annualInterest = bondStore.runningCalcs[i-1].annualInterest
    }
    bondStore.runningCalcs[i].monthlyInterest = bondStore.runningCalcs[i].annualInterest/1200

    // payment calcs
    if (bondStore.actualPayment === null || bondStore.actualPayment <= bondStore.minPayment || !bondStore.customPayments) {
      bondStore.actualPayment = bondStore.minPayment
      bondStore.customPayments = false
    }
    if (bondStore.adHocMonthlyPayments[i]) {
      bondStore.runningCalcs[i].payment = bondStore.adHocMonthlyPayments[i]
    } else if (i == 0) {
      bondStore.runningCalcs[i].payment = bondStore.actualPayment
    } else if (bondStore.runningCalcs[i-1].capital*(1 + bondStore.runningCalcs[i].monthlyInterest) < bondStore.runningCalcs[i-1].payment) {
      bondStore.runningCalcs[i].payment = bondStore.runningCalcs[i-1].capital*(1 + bondStore.runningCalcs[i].monthlyInterest)
    } else {
      bondStore.runningCalcs[i].payment = bondStore.runningCalcs[i-1].payment
    }

    //running capital
    if (i == 0) {
      bondStore.runningCalcs[i].capital = bondStore.loanAmount
    } else {
      bondStore.runningCalcs[i].capital = bondStore.runningCalcs[i-1].capital*(1 + bondStore.runningCalcs[i].monthlyInterest) - bondStore.runningCalcs[i].payment - bondStore.adHocPayments[i]
    }

    // total contribution tally
    if (i > 0 && i < 60*12+1) {
      bondStore.totalContribution += Number(bondStore.runningCalcs[i].payment) + Number(bondStore.adHocPayments[i])
    }
  })

  // last payment month and amount and chart data update
  const lastMonth = bondStore.runningCalcs.findIndex((x) => x.capital <= 0)

  if(lastMonth == -1) {
    bondStore.duration = "NEVER (more than 60 years!)"
    bondStore.finalPayment = bondStore.actualPayment
    bondStore.finalYear = 60

    chartData.labels = Array.from({length: bondStore.finalYear * 12}, (x, i) => dateToMonth(bondStore.dates[i]))
    chartData.datasets[0].data = Array.from({length: bondStore.finalYear * 12}, (x, i) => {return bondStore.runningCalcs[i].capital})
  } else {
    const _years = Math.floor(lastMonth/12)
    const _months = lastMonth%12
    const _monthTerm = _months ==1 ? "month" : "months"
    bondStore.duration = `${_years} years and ${_months} ${_monthTerm}`
    bondStore.finalPayment = bondStore.runningCalcs[lastMonth].payment
    bondStore.finalYear = _months > 0 ? _years + 1 : _years
    

    chartData.labels = Array.from({length: lastMonth}, (x, i) => dateToMonth(bondStore.dates[i]))

    chartData.datasets[0].data = Array.from({length: lastMonth}, (x, i) => {return bondStore.runningCalcs[i].capital})
  }
}

watchEffect(() => parseCalcs())

const buttonPress = () => {
  console.log(bondStore)
}

const actualPaymentInput = () => {
  bondStore.customPayments = true
}

</script>

<style scoped>

th {
  border-bottom: 1px solid black;
}



  
</style>


