<template>
 <div class=" m-2 flex justify-content-center align-content-center">
    <div class="w-full flex flex-column justify-content-center" style="max-width: 60rem;" >
      <div class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around">
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="currencies" class="font-bold block"> Currency: </label>
          <Dropdown v-model.lazy="props.currency" :options="Object.values(currencies)" optionLabel="code" inputId="currencies" class="w-full md:w-14rem" />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="loan-amount" class="font-bold block"> Loan Amount: </label>
          <InputNumber v-model.lazy="props.loanAmount" inputId="loan-amount" mode="currency" :currency="props.currency.code" locale="en-US" :step="50000" />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="interestRate" class="font-bold block"> Interest Rate: </label>
          <InputNumber style="width: 10rem;" v-model.lazy="props.interestRate" mode="decimal" :minFractionDigits="2" :min="0"  inputId="interestRate" suffix="%" />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="loanPeriod" class="font-bold block"> Loan Period: </label>
          <InputNumber v-model.lazy="props.loanPeriod" mode="decimal" :minFractionDigits="0"  inputId="loanPeriod" suffix=" Yrs" :step="5" />
        </div>
      </div>
      <div class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around">
        <div class="w-14rem m-1">
          <label for="actualPayment" class="font-bold block"> Monthly Payment Amount: {{props.customPayment ? '' : '*'}}</label>
          <div class="p-inputgroup">
            <InputNumber v-model.lazy="actualPayment" mode="currency" :currency="props.currency.code" locale="en-US" inputId="actualPayment" :step="100"/>
            <Button icon="pi pi-refresh" @click="actualPayment = minPayment" />
          </div>
        </div>
        <div class="w-14rem m-1">
          <label for="startDate" class="font-bold block"> First Payment Month: </label>
          <Calendar v-model.lazy="props.startingDate" view="month" dateFormat="MM yy" showIcon />
        </div>
      </div>
      <Fieldset class="m-3 flex justify-content-center" legend="Basic Loan Info" :toggleable="true" :collapsed="true">
        <div class="m-0">
          <div>
            <label for="minPayment" class=""> Minimum monthly payments: </label>
            <InputNumber v-model.lazy="minPayment" mode="currency" :currency="props.currency.code" locale="en-US" disabled inputId="minPayment" />
          </div>
          <div class=" block my-2"> Loan will be paid off in <span class="font-bold">{{duration}}</span>.</div>
          <div>
            <label for="lastPayment" class=""> Last payment amount will be: </label>
            <InputNumber v-model.lazy="finalPayment" mode="currency" :currency="props.currency.code" locale="en-US" disabled inputId="lastPayment" />
          </div>
          <div>
            <label for="totalPayments" class=""> Total amount paid over the period of the loan: </label>
            <InputNumber v-model.lazy="totalContribution" mode="currency" :currency="props.currency.code" locale="en-US" disabled inputId="totalPayments" />
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

        <!-- <Button label="Ad-Hoc Payments (Old)" icon="pi pi-external-link" @click="showAdHocPaymentsOldDialog = true" />
        <Dialog class="w-11" v-model:visible="showAdHocPaymentsOldDialog" modal header="AD-HOC PAYMENTS" style="max-width: 60rem;" >
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
              <tr v-for="m in bond.finalYear + 1" :key="m">
                <td>{{ bond.startingDate.getFullYear() + m-1 }}</td>
                <td v-for="i in 12" :key="i">
                  <input v-if="(m < 2 && i < bond.startingDate.getMonth()+1) || (m == bond.finalYear + 1 && i > bond.monthlyFigures[bond.monthlyFigures.length-1].date.getMonth())" type="number" disabled="true" style="width: 5em;">
                  <input v-else type="number" v-model.lazy="bond.adHocPayments[(m-1)*12 + i - bond.startingDate.getMonth()]" placeholder="0" style="width: 5em;">
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
import { reactive, ref, defineProps, computed, watch } from "vue"

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

// PROPS
const props = defineProps({
  currency: {
    type: Object,
    default() { return {
      symbol: "$",
      name: "US Dollar",
      decimal_digits: 2,
      rounding: 0,
      code: "USD",
      name_plural: "US dollars"
    }}
  },
  loanAmount: {
    type: Number,
    default: 500000
  },
  interestRate: {
    type: Number,
    default: 5
  },
  loanPeriod: {
    type: Number,
    default: 30
  },
  startingDate: {
    type: Date,
    default: new Date()
  }
})


// COMPONENT VARIABLES
const adHocPayments = reactive(Array.from({length: 60*12+1}, () => 0))
const adHocInterest = reactive(Array.from({length: 60*12+1}, () => null))
const adHocMonthlyPayments = reactive(Array.from({length: 60*12+1}, () => null))
let actualPayment = ref(null)
let customPayment = ref(false)


//COMPUTED PROPERTIES
// const dates = computed(() => {
//   const _startMonth = props.startingDate.getMonth()
//   const _datesArray = Array.from({length: 60 * 12}, (x, i) => {
//     const _currentMonth = new Date(props.startingDate)
//     _currentMonth.setMonth(_startMonth + i)
//     return _currentMonth
//   })
//   return _datesArray
// })

const monthlyInterest = computed(() => {
  return props.interestRate/1200
})

const periodInMonths = computed(() => {
  return props.loanPeriod*12
})

const minPayment = computed(() => {
  return (props.loanAmount*monthlyInterest.value)/(1-1/((1+monthlyInterest.value)**periodInMonths.value))
})

// const startingDateString = computed(() => {
//   return dateToMonth(props.startingDate)
// })

// monthlyFigures
const monthlyFigures = computed(() => {
  console.log("montlyFigures")
  let _monthlyFigures = []
  do {
    const _i = _monthlyFigures.length

    // calcs go here
    //date & dateString
    const tempDate = new Date(props.startingDate).setMonth(props.startingDate.getMonth() + _i)
    const temDateString = dateToMonth(new Date(tempDate))
    // interests
    let annualInterest = props.interestRate
    if (adHocInterest[_i]) {
      annualInterest = adHocInterest[_i]
    } else if (_i > 0) {
      annualInterest = _monthlyFigures[_i-1].annualInterest
    }
    let monthlyInterest = annualInterest/1200
    // ad hoc payment
    let adHocPayment = adHocPayments[_i]
    // this months payment
    let _payment = minPayment.value
    if (adHocMonthlyPayments[_i]) {
      _payment = adHocMonthlyPayments[_i]
    } else if (_i === 0 || !isNaN(actualPayment)) {
      _payment = actualPayment
    } else if (_monthlyFigures[_i-1].capital*(1 + monthlyInterest) < _monthlyFigures[_i-1].payment) {
      _payment = _monthlyFigures[_i-1].capital*(1 + monthlyInterest)
    } else {
      _payment = _monthlyFigures[_i-1].payment
    }
    //capital
    let _capital
    if (_i === 0) {
      _capital = props.loanAmount
    } else {
      _capital = _monthlyFigures[_i-1].capital*(1 + monthlyInterest) - _payment - adHocPayment
    }
    //contribution
    let _contribution
    if (_i === 0) {
      _contribution = 0
    } else {
      _contribution = _monthlyFigures[_i-1].contribution + _payment + adHocPayment
    }

    // push all calculated things to array
    _monthlyFigures.push({
      date: new Date(tempDate),
      dateString: temDateString,
      annualInterest,
      monthlyInterest,
      adHocPayment,
      payment: _payment,
      capital: _capital,
      contribution: _contribution
    })

  } while (_monthlyFigures[_monthlyFigures.length-1].capital > 0)

  return _monthlyFigures
})

// finalPayment
const finalPayment = computed(() => {
  return monthlyFigures.value[monthlyFigures.value.length-1].payment
})

// // finalYear
// const finalYear = computed(() => {
//   return Math.ceil(monthlyFigures.value.length/12) - 1
// })

// duration
const duration = computed(() => {
  const _lastMonth = monthlyFigures.value.length - 1
  if (isNaN(_lastMonth)) {
    return "?! Something Went Wrong !?"
  } else {
    const _years = Math.floor(_lastMonth/12)
    const _months = _lastMonth%12
    const _monthTerm = _months ==1 ? "month" : "months"
    return `${_years} years and ${_months} ${_monthTerm}`
  }
})

// totalContribution
const totalContribution = computed(() => {
  return monthlyFigures.value[monthlyFigures.value.length-1].contribution
})

const chartData = computed(() => {
  return {
    labels: Array.from(monthlyFigures, (x) => x.dateString),
    datasets: [
      {
        label: "Loan Capital",
        data: Array.from(monthlyFigures, (x) => x.capital),
      }
    ]
  }
})


//WATCHERS
watch(() => actualPayment, (newPayment) => {
  if (isNaN(newPayment) || newPayment <= minPayment.value || !customPayment.value) {
    actualPayment.value = minPayment.value
    customPayment.value = false
  } else {
    customPayment.value = true
  }
})

watch(() => minPayment, () => {
  if (isNaN(actualPayment.value) || actualPayment.value <= minPayment.value || !customPayment.value) {
    actualPayment.value = minPayment.value
    customPayment.value = false
  }
})


// METHODS
function dateToMonth(_date) {
  return _date.toISOString().split("T")[0].split("-").slice(0, 2).join("-")
}

function buttonPress() {
  console.log(minPayment.value)
}
  
</script>

<style>
  
</style>