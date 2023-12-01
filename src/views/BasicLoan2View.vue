<template>
 <div class=" m-2 flex justify-content-center align-content-center">
    <div class="w-full flex flex-column justify-content-center" style="max-width: 60rem;" >
      <div class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around">
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="currencies" class="font-bold block"> Currency: </label>
          <Dropdown v-model.lazy="bond.currency" :options="Object.values(currencies)" optionLabel="code" inputId="currencies" class="w-full md:w-14rem" />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="loan-amount" class="font-bold block"> Loan Amount: </label>
          <InputNumber v-model.lazy="bond.loanAmount" inputId="loan-amount" mode="currency" :currency="bond.currency.code" locale="en-US" :step="50000" />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="interestRate" class="font-bold block"> Interest Rate: </label>
          <InputNumber style="width: 10rem;" v-model.lazy="bond.interestRate" mode="decimal" :minFractionDigits="2" :min="0"  inputId="interestRate" suffix="%" />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="loanPeriod" class="font-bold block"> Loan Period: </label>
          <InputNumber v-model.lazy="bond.loanPeriod" mode="decimal" :minFractionDigits="0"  inputId="loanPeriod" suffix=" Yrs" :step="5" />
        </div>
      </div>
      <div class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around">
        <div class="w-14rem m-1">
          <label for="actualPayment" class="font-bold block"> Monthly Payment Amount: {{bond.customPayment ? '' : '*'}}</label>
          <div class="p-inputgroup">
            <InputNumber v-model.lazy="bond.payments" mode="currency" :currency="bond.currency.code" locale="en-US" inputId="actualPayment" :step="100"/>
            <Button icon="pi pi-refresh" @click="bond.actualPayment = bond.minPayment" />
          </div>
        </div>
        <div class="w-14rem m-1">
          <label for="startDate" class="font-bold block"> First Payment Month: </label>
          <Calendar v-model.lazy="bond.startingDate" view="month" dateFormat="MM yy" showIcon />
        </div>
      </div>
      <Fieldset class="m-3 flex justify-content-center" legend="Basic Loan Info" :toggleable="true" :collapsed="true">
        <div class="m-0">
          <div>
            <label for="minPayment" class=""> Minimum monthly payments: </label>
            <InputNumber v-model.lazy="bond.minPayment" mode="currency" :currency="bond.currency.code" locale="en-US" disabled inputId="minPayment" />
          </div>
          <div class=" block my-2"> Loan will be paid off in <span class="font-bold">{{bond.duration}}</span>.</div>
          <div>
            <label for="lastPayment" class=""> Last payment amount will be: </label>
            <InputNumber v-model.lazy="bond.finalPayment" mode="currency" :currency="bond.currency.code" locale="en-US" disabled inputId="lastPayment" />
          </div>
          <div>
            <label for="totalPayments" class=""> Total amount paid over the period of the loan: </label>
            <InputNumber v-model.lazy="bond.totalContribution" mode="currency" :currency="bond.currency.code" locale="en-US" disabled inputId="totalPayments" />
          </div>
        </div>
      </Fieldset>
      <div class="w-full card align-self-center" >
        <PrimeChart ref="primaryChart" :chart-data="chartData"/>
      </div>
      <div>
        <!-- <Button label="Once-Off Payments" icon="pi pi-external-link" @click="showAdHocPaymentsDialog = true" />
        <Dialog class="w-11" v-model:visible="showAdHocPaymentsDialog" modal header="ONCE-OFF PAYMENTS" style="max-width: 60rem;" >
          <DataTable >
            <ColumnGroup type="header">
              <Row>
                <Column header="Enter any additional payments which you make into your bond account. Loans from it are entered as negative numbers." :colspan="13" />
              </Row>
              <Row>
                <Column header="Year" :rowspan="2" />
                <Column header="Month" :colspan="12" />
              </Row>
              <Row>
                <Column v-for="n in 12" :key="n" :header="n" />
              </Row>
            </ColumnGroup>
            
          </DataTable>
        </Dialog> -->

        <!-- <Button label="Ad-Hoc Payments (Old)" icon="pi pi-external-link" @click="showAdHocPaymentsDialog = true" />
        <Dialog class="w-11" :visible="false" modal header="AD-HOC PAYMENTS" style="max-width: 60rem;" >
          <table >
            <thead>
              <tr>
                <th colspan="13">Enter any additional payments which you make into your bond account. Loans from it are entered as negative numbers.</th>
              </tr>
              <tr>
                <th>Month:</th>
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
        </Dialog> -->

        <!-- <Button label="Interest Rates" icon="pi pi-external-link" @click="showInterestRatesDialog = true" />
        <Dialog class="w-11" v-model:visible="showInterestRatesDialog" modal header="INTEREST RATES" style="max-width: 60rem;" >
          <table>
            <thead>
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
        </Dialog> -->

        <!-- <Button label="Bond Repayments" icon="pi pi-external-link" @click="showBondPaymentsDialog = true" />
        <Dialog class="w-11" v-model:visible="showBondPaymentsDialog" modal header="BOND REPAYMENTS" style="max-width: 60rem;" >
          <table>
            <thead>
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
        </Dialog> -->

        <!-- <Button label="Running Capital" icon="pi pi-external-link" @click="showRunningCapitalDialog = true" />
        <Dialog class="w-11" v-model:visible="showRunningCapitalDialog" modal header="RUNNING CAPITAL" style="max-width: 60rem;" >
          <table>
            <thead>
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
        </Dialog> -->
      </div>
    </div>
  </div>

  <Button label="Log Bond" icon="pi pi-external-link" @click="buttonPress" />
  
</template>

<script setup>
import {ref, reactive, onMounted, computed, onBeforeMount } from "vue"
import BasicLoan from "../components/BasicLoan.js"

// import { bondStore, dateToMonth } from "../Stores/bond"
import currencies from "../assets/currencies.json"
import PrimeChart from "../components/PrimeChart.vue"

// PrimeVue imports...
import InputNumber from "primevue/inputnumber"
import Button from "primevue/button"
import Dropdown from "primevue/dropdown"
import Calendar from "primevue/calendar"
import Fieldset from "primevue/fieldset"
import Dialog from "primevue/dialog"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import ColumnGroup from "primevue/columngroup"   // optional
import Row from "primevue/row"                   // optional


const currencyFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const primaryChart = ref()

const showAdHocPaymentsDialog = ref(false)
const showInterestRatesDialog = ref(false)
const showBondPaymentsDialog = ref(false)
const showRunningCapitalDialog = ref(false)

let bond = undefined

onBeforeMount(() => {
  bond = reactive(new BasicLoan(currencies.USD, 500000, 7, 30, new Date()))
})

onMounted(() => {
  window.addEventListener("resize", resizeHandler.execute)
})

const chartData = computed(() => {
  return {
    labels: Array.from(bond.monthlyFigures, (x, i) => x.dateString),
    datasets: [
      {
        label: "Loan Capital",
        data: Array.from(bond.monthlyFigures, (x, i) => x.capital),
      }
    ]
  }
})


// const chartData = reactive({
//   labels: Array.from({length: bondStore.finalYear * 12}, (x, i) => i),
//   datasets: [
//     {
//       label: "Loan Capital",
//       data: Array.from({length: bondStore.loanPeriod * 12}, () => bondStore.loanAmount),
//     }
//   ]
// })

const buttonPress = () => {
  console.log(chartData)
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


