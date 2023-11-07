<template>
  <div class=" m-2 flex justify-content-center align-content-center">
    <div class="w-full flex flex-column justify-content-center" style="max-width: 60em;" >
      <div class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around">
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="currencies" class="font-bold block"> Currency: </label>
          <Dropdown v-model.lazy="bondStore.currency" :options="Object.values(currencies)" optionLabel="code" inputId="currencies" class="w-full md:w-14rem" />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="loan-amount" class="font-bold block"> Loan Amount: </label>
          <InputNumber v-model.lazy="bondStore.loanAmount" inputId="loan-amount" mode="currency" :currency="bondStore.currency.code" locale="en-US" :step="50000" />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="interestRate" class="font-bold block"> Interest Rate: </label>
          <InputNumber style="width: 10rem;" v-model.lazy="bondStore.interestRate" mode="decimal" :minFractionDigits="2" :min="0"  inputId="interestRate" suffix="%" />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="loanPeriod" class="font-bold block"> Loan Period: </label>
          <InputNumber v-model.lazy="bondStore.loanPeriod" mode="decimal" :minFractionDigits="0"  inputId="loanPeriod" suffix=" Yrs" :step="5" />
        </div>
      </div>
      <div class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around">
        <div class="w-14rem m-1">
          <label for="actualPayment" class="font-bold block"> Monthly Payment Amount: {{bondStore.customPayments ? '' : '*'}}</label>
          <InputNumber v-model.lazy="bondStore.actualPayment" mode="currency" @input="actualPaymentInput" :currency="bondStore.currency.code" locale="en-US" inputId="actualPayment" :step="100"/>
        </div>
        <div class="w-14rem m-1">
          <label for="startDate" class="font-bold block"> First Payment Month: </label>
          <Calendar v-model.lazy="bondStore.startingDate" view="month" dateFormat="MM yy" showIcon />
        </div>
      </div>
      <Fieldset class="m-3 flex justify-content-center" legend="Basic Loan Info" :toggleable="true" :collapsed="true">
        <div class="m-0">
          <div>
            <label for="minPayment" class=""> Minimum monthly payments: </label>
            <InputNumber v-model.lazy="bondStore.minPayment" mode="currency" :currency="bondStore.currency.code" locale="en-US" disabled inputId="minPayment" />
          </div>
          <div class=" block my-2"> Loan will be paid off in <span class="font-bold">{{bondStore.duration}}</span>.</div>
          <div>
            <label for="lastPayment" class=""> Last payment amount will be: </label>
            <InputNumber v-model.lazy="bondStore.finalPayment" mode="currency" :currency="bondStore.currency.code" locale="en-US" disabled inputId="lastPayment" />
          </div>
          <div>
            <label for="totalPayments" class=""> Total amount paid over the period of the loan: </label>
            <InputNumber v-model.lazy="bondStore.totalContribution" mode="currency" :currency="bondStore.currency.code" locale="en-US" disabled inputId="totalPayments" />
          </div>
        </div>
      </Fieldset>
      <div class="w-full card align-self-center" >
        <PrimeChart ref="primaryChart" :chart-data="chartData"/>
        <Button icon="pi pi-refresh" @click="primaryChart.reinit()" />
      </div>
    </div>
  </div>

  
  <!-- _____________________________________________________________________________________________________________ -->
  <div class="bg-primary md:bg-primary-reverse lg:bg-primary max-w-screen">Colours will invert during md size only.</div>
  <Button icon="pi pi-question-circle" @click="buttonPress" />
  <div>
    <Button @click="adHocPaymentsDialog.showModal()"> Ad-Hoc Payments</Button>
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
      <Button @click="adHocPaymentsDialog.close()">Close</Button>
    </dialog>
    <Button @click="interestRatesDialog.showModal()"> Interest Rates</Button>
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
      <Button @click="interestRatesDialog.close()">Close</Button>
    </dialog>
    <Button @click="bondPaymentsDialog.showModal()"> Bond Repayments</Button>
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
      <Button @click="bondPaymentsDialog.close()">Close</Button>
    </dialog>
    <Button @click="runningCapitalDialog.showModal()"> Running Capital</Button>
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
      <Button @click="runningCapitalDialog.close()">Close</Button>
    </dialog>
  </div>
  
</template>

<script setup>
import {ref, reactive, watchEffect, onMounted } from "vue"
import { bondStore, dateToMonth } from "../Stores/bond"
import currencies from "../assets/currencies.json"
import PrimeChart from "../components/PrimeChart.vue"

// PrimeVue imports...
import InputNumber from "primevue/inputnumber"
import Button from "primevue/button"
import Dropdown from "primevue/dropdown"
import Calendar from "primevue/calendar"
import Fieldset from "primevue/fieldset"

const currencyFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const adHocPaymentsDialog = ref()
const interestRatesDialog = ref()
const bondPaymentsDialog = ref()
const runningCapitalDialog = ref()
const primaryChart = ref()

onMounted(() => {
  window.addEventListener("resize", resizeHandler.execute)
})


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
  console.log(primaryChart)
}

const actualPaymentInput = () => {
  bondStore.customPayments = true
}

const resizeHandler = {
  timeOut: null,
  execute: function() {
    if (this.timeOut) {
      clearTimeout(this.timeOut)
    }
    this.timeOut = setTimeout(primaryChart.value.reinit, 100)
  }
}

</script>

<style scoped>

th {
  border-bottom: 1px solid black;
}



  
</style>


