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
            <InputNumber v-model.lazy="bond.actualPayment" mode="currency" :currency="bond.currency.code" locale="en-US" inputId="actualPayment" :step="100" :min="minPayment"/>
            <Button icon="pi pi-refresh" @click="bond.actualPayment = minPayment" title="Reset to Min Payment" />
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
            <InputNumber v-model.lazy="minPayment" mode="currency" :currency="bond.currency.code" locale="en-US" disabled inputId="minPayment" />
          </div>
          <div class=" block my-2"> Loan will be paid off in <span class="font-bold">{{duration}}</span>.</div>
          <div class=" block my-2"> Last payment will be on <span class="font-bold">{{finalMonthName}} {{ finalYear }}</span>.</div>
          <div>
            <label for="lastPayment" class=""> Last payment amount will be: </label>
            <InputNumber v-model.lazy="finalPayment" mode="currency" :currency="bond.currency.code" locale="en-US" disabled inputId="lastPayment" />
          </div>
          <div>
            <label for="totalPayments" class=""> Total amount paid over the period of the loan: </label>
            <InputNumber v-model.lazy="totalContribution" mode="currency" :currency="bond.currency.code" locale="en-US" disabled inputId="totalPayments" />
          </div>
        </div>
      </Fieldset>
      <div class="w-full card align-self-center" >
        <PrimeChart ref="primaryChart" :chart-data="chartData"/>
      </div>
      <div>
        <Button label="Once-Off Payments" icon="pi pi-external-link" @click="modals.OnceOffPayments = true" />
        <Dialog class="w-11" v-model:visible="modals.OnceOffPayments" modal header="MONTHLY DATA" style="max-width: 60rem;" >
          <DataTable :value="monthlyFiguresArray" tableStyle="min-width: 50rem">
            <Column field="date" header="Date"></Column>
            <Column field="onceOffPayment" header="Once-off Payment"></Column>
            <Column field="payment" header="Monthly Payments"></Column>
            <Column field="interest" header="Interest Rate"></Column>
            <Column field="capital" header="Capital"></Column>
            <Column field="contribution" header="Total Contribution"></Column>
          </DataTable>
        </Dialog>

        <Button label="Ad-Hoc Payments (Old)" icon="pi pi-external-link" @click="modals.AdHocPayments = true" />
        <Dialog class="w-11" v-model:visible="modals.AdHocPayments" modal header="AD-HOC PAYMENTS" style="max-width: 60rem;" >
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
              <tr v-for="m in totalYears + 2" :key="m">
                <td>{{ startingYear + m-1 }}</td>
                <td v-for="i in 12" :key="i">
                  <input v-if="!monthlyFigures[(m-1)*12 + i - startingMonth - 1]" placeholder="-" type="number" disabled="true" style="width: 5em;">
                  <input v-else type="number" v-model.lazy="bond.adHocPayments[(m-1)*12 + i - startingMonth]" placeholder="0" style="width: 5em;">
                </td>
              </tr>
            </tbody>
          </table>
        </Dialog>

        <Button label="Interest Rates" icon="pi pi-external-link" @click="modals.InterestRates = true" />
        <Dialog class="w-11" v-model:visible="modals.InterestRates" modal header="INTEREST RATES" style="max-width: 60rem;" >
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
              <tr v-for="m in totalYears + 2" :key="m">
                <td>{{ startingYear + m-1 }}</td>
                <td v-for="i in 12" :key="i">
                  <input v-if="!monthlyFigures[(m-1)*12 + i - startingMonth - 1]" placeholder="-" type="number" disabled="true" style="width: 5em;">
                  <input v-else type="number" v-model.lazy="bond.adHocInterest[(m-1)*12 + i - startingMonth]" :placeholder="monthlyFigures[(m-1)*12 + i - startingMonth - 1].annualInterest" style="width: 5em;">
                </td>
              </tr>
            </tbody>
          </table>
        </Dialog>

        <Button label="Bond Repayments" icon="pi pi-external-link" @click="modals.BondRepayments = true" />
        <Dialog class="w-11" v-model:visible="modals.BondRepayments" modal header="BOND REPAYMENTS" style="max-width: 60rem;" >
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
              <tr v-for="m in totalYears + 2" :key="m">
                <td>{{ startingYear + m-1 }}</td>
                <td v-for="i in 12" :key="i">
                  <input v-if="!monthlyFigures[(m-1)*12 + i - startingMonth - 1]" placeholder="-" type="number" disabled="true" style="width: 5em;">
                  <input v-else type="number" v-model.lazy="bond.adHocMonthlyPayments[(m-1)*12 + i - startingMonth]" :placeholder="monthlyFigures[(m-1)*12 + i - startingMonth - 1].payment" style="width: 5em;">
                </td>
              </tr>
            </tbody>
          </table>
        </Dialog>

        <Button label="Running Capital" icon="pi pi-external-link" @click="modals.RunningCapital = true" />
        <Dialog class="w-11" v-model:visible="modals.RunningCapital" modal header="RUNNING CAPITAL" style="max-width: 60rem;" >
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
              <tr v-for="m in totalYears + 2" :key="m">
                <td>{{ startingYear + m -1 }}</td>
                <td v-for="i in 12" :key="i">
                  <!-- <div v-if="!monthlyFigures[(m-1)*12 + i - startingMonth - 1]" style="width: 7em; text-align: center;">-</div> -->
                  <input v-if="!monthlyFigures[(m-1)*12 + i - startingMonth - 1]" placeholder="-" type="number" disabled="true" style="width: 5em;">
                  <input v-else type="number" :placeholder="monthlyFigures[(m-1)*12 + i - startingMonth - 1].capital" disabled="true" style="width: 5em;">
                  <!-- <div v-else style="width: 5em;">
                    <InputNumber v-model.lazy="monthlyFigures[(m-1)*12 + i - startingMonth - 1].capital" mode="currency" :currency="bond.currency.code" locale="en-US" disabled/>
                  </div> -->
                  <!-- <div v-else style="width: 7em;">{{bond.currency.symbol}}{{ currencyFormatter.format(bondStore.runningCalcs[(m-1)*12 + i - bondStore.dates[0].getMonth()].capital) }}</div> -->
                </td>
              </tr>
            </tbody>
          </table>
        </Dialog>
      </div>
    </div>
  </div>

  <Button label="Log Bond" icon="pi pi-external-link" @click="console.log(monthlyFigures)" />
  <Button label="Log Bond" icon="pi pi-external-link" @click="console.log(monthlyFiguresArray)" />
  
</template>

<script setup>
import { reactive, computed, watch } from "vue"
import { calcMinPayment, monthlyCalcs, basicCalcs, calcDuration, getMonthName } from "../assets/LoanCalcs"

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
// import ColumnGroup from "primevue/columngroup"
// import Row from "primevue/row"

// COMPONENT VARIABLES
const bond = reactive({
  currency: {
    symbol: "$",
    name: "US Dollar",
    decimal_digits: 2,
    rounding: 0,
    code: "USD",
    name_plural: "US dollars"
  },
  loanAmount: 500000,
  interestRate: 7,
  loanPeriod: 30,
  actualPayment: calcMinPayment(500000, 7, 30),
  customPayment: false,
  startingDate: new Date(),
  adHocPayments: Array.from({length: 60*12+1}, () => 0),
  adHocInterest: Array.from({length: 60*12+1}, () => null),
  adHocMonthlyPayments: Array.from({length: 60*12+1}, () => null)
})

const modals = reactive({
  OnceOffPayments: false,
  AdHocPayments: false,
  InterestRates: false,
  BondRepayments: false,
  RunningCapital: false

})

//COMPUTED PROPERTIES
const minPayment = computed(() => calcMinPayment(bond.loanAmount, bond.interestRate, bond.loanPeriod))
const monthlyFigures = computed(() => monthlyCalcs(bond))
const defaultFigures = computed(() => basicCalcs(bond))
const finalPayment = computed(() => monthlyFigures.value[monthlyFigures.value.length-1].payment)
const duration = computed(() => calcDuration(monthlyFigures.value.length - 1))
const totalContribution = computed(() => monthlyFigures.value[monthlyFigures.value.length-1].contribution)
const startingYear = computed(() => bond.startingDate.getFullYear())
const startingMonth = computed(() => bond.startingDate.getMonth())
const finalMonth = computed(() => monthlyFigures.value[monthlyFigures.value.length-1].date.getMonth())
const finalMonthName = computed(() => getMonthName(finalMonth.value))
const finalYear = computed(() => monthlyFigures.value[monthlyFigures.value.length-1].date.getFullYear())
const totalYears = computed(() => Math.floor(monthlyFigures.value.length/12))
const chartData = computed(() => {
  return {
    labels: Array.from(defaultFigures.value, (x) => x.dateString),
    datasets: [
      {
        label: "Loan Capital",
        data: Array.from(monthlyFigures.value, (x) => x.capital),
      },
      {
        label: "Original Loan",
        data: Array.from(defaultFigures.value, (x) => x.capital),
        fill: false,
        borderDash: [2],
        borderWidth: 2
      }
    ]
  }
})
const monthlyFiguresArray = computed(() => Array.from(monthlyFigures.value, (month) => {
  return {
    onceOffPayment: month.adHocPayment.toFixed(2),
    interest: month.annualInterest,
    capital: month.capital.toFixed(2),
    contribution: month.contribution.toFixed(2),
    date: month.dateString,
    payment: month.payment.toFixed(2)
  }
}))

//WATCHERS
watch(() => bond.actualPayment, (newPayment) => {
  if (isNaN(newPayment) || newPayment <= minPayment.value) {
    bond.actualPayment = minPayment.value
    bond.customPayment = false
  } else {
    bond.customPayment = true
  }
})

watch(() => minPayment.value, () => {
  if (isNaN(bond.actualPayment) || bond.actualPayment <= minPayment.value || !bond.customPayment) {
    bond.actualPayment = minPayment.value
    bond.customPayment = false
  }
})

// METHODS

</script>

<style>
  
</style>