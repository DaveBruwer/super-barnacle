<template>
  <div style="display: flex; flex-direction: column; padding: 1em;">
    <div style="display: flex; justify-content: space-around;">
      <div>
        <label for="loanAmount">Loan Amount: {{bondStore.currency}}</label>
        <input id="loanAmount" type="number" min="1" v-model.lazy="bondStore.loanAmount" style="width: 7em;">
      </div>
      <div>
        <label for="interestRate">Interest Rate: </label>
        <input id="interestRate" type="number" min="1" max="100" v-model.lazy="bondStore.interestRate" style="width: 3em; text-align: end;">
        <span>%</span>
      </div>
      <div>
        <label for="loanPeriod">Loan Period: </label>
        <input id="loanPeriod" type="number" min="1" max="720" v-model.lazy="bondStore.loanPeriod" style="width: 3em; text-align: end;">
        <span>Years</span>
      </div>
    </div>
    <div style="display: flex; justify-content: space-around;">
      <div>
        <label for="MinPayment">Min Monthly Payment: {{bondStore.currency}}</label>
        <span>{{ currencyFormatter.format(bondStore.minPayment) }}</span>
      </div>
      <div>
        <label for="ActPayment">Actual Monthly Payment: {{bondStore.currency}}</label>
        <input id="ActPayment" type="number" min="1" :placeholder="currencyFormatter.format(bondStore.minPayment)" v-model.lazy="bondStore.actualPayment">
      </div>
      <div>
        <label for="startDate">First Payment: </label>
        <input type="month" v-model="bondStore.startingDate">
      </div>
    </div>
    <div>
      <label for="LoanPayPeriod">Loan to be paid off in: </label>
      <span>{{bondStore.duration}}</span>
    </div>
    <div>
      <label for="LastPayment">Last payment amount: </label>
      <span>{{bondStore.currency}}{{currencyFormatter.format(bondStore.finalPayment)}}</span>
    </div>
    <div>
      <label for="TotalAmount">Total amount paid over period of load: </label>
      <span>${{currencyFormatter.format(bondStore.totalContribution)}}</span>
    </div>
  </div>
  <div style="width: 50em;">
    <LineChart style="margin: 1em;" :chart-data="chartData"/>
  </div>
<!-- _____________________________________________________________________________________________________________ -->
  <div>
    <button @click="adHocToggles.adHocPayments = !adHocToggles.adHocPayments"> Ad-Hoc Payments</button>
    <table v-if="adHocToggles.adHocPayments">
      <thead>
        <tr>
          <th colspan="13">AD HOC PAYMENTS</th>
        </tr>
        <tr>
          <th colspan="13">Enter any additional payments which you make into your bond account. Loans from it are entered as negative numbers.</th>
        </tr>
        <tr>
          <th></th>
          <th v-for="n in 12">{{months[n-1]}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in bondStore.finalYear + 1">
          <td>{{ bondStore.dates[0].getFullYear() + m-1 }}</td>
          <td v-for="i in 12">
            <input v-if="(m < 2 && i < bondStore.dates[0].getMonth()+1) || (m == bondStore.finalYear + 1 && i > bondStore.dates[bondStore.finalYear*12].getMonth())" type="number" disabled="true" style="width: 5em;">
            <input v-else type="number" v-model="bondStore.adHocPayments[(m-1)*12 + i - bondStore.dates[0].getMonth()]" placeholder="0" style="width: 5em;">
          </td>
        </tr>
      </tbody>
    </table>
<!-- _____________________________________________________________________________________________________________ -->
    <button @click="adHocToggles.interestRates = !adHocToggles.interestRates"> Interest Rates</button>
    <table v-if="adHocToggles.interestRates">
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
          <th v-for="n in 12">{{n}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in bondStore.finalYear + 1">
          <td>{{ bondStore.dates[0].getFullYear() + m-1 }}</td>
          <td v-for="i in 12">
            <input v-if="(m < 2 && i < bondStore.dates[0].getMonth()+1) || (m == bondStore.finalYear + 1 && i > bondStore.dates[bondStore.finalYear*12].getMonth())" type="number" disabled="true" style="width: 5em;">
            <input v-else type="number" v-model="bondStore.adHocInterest[(m-1)*12 + i]" :placeholder="bondStore.runningCalcs[(m-1)*12 + i - bondStore.dates[0].getMonth()].annualInterest" style="width: 5em;">
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="adHocToggles.bondPayments = !adHocToggles.bondPayments"> Bond Repayments</button>
    <table v-if="adHocToggles.bondPayments">
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
          <th v-for="n in 12">{{n}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in bondStore.finalYear + 1">
          <td>{{ bondStore.dates[0].getFullYear() + m-1 }}</td>
          <td v-for="i in 12">
            <input v-if="(m < 2 && i < bondStore.dates[0].getMonth()+1) || (m == bondStore.finalYear + 1 && i > bondStore.dates[bondStore.finalYear*12].getMonth())" type="number" disabled="true" style="width: 5em;">
            <input v-else type="number" v-model="bondStore.adHocMonthlyPayments[(m-1)*12 + i]" :placeholder="bondStore.runningCalcs[(m-1)*12 + i - bondStore.dates[0].getMonth()].payment" style="width: 5em;">
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="adHocToggles.runningCapital = !adHocToggles.runningCapital"> Running Capital</button>
    <table v-if="adHocToggles.runningCapital">
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
          <th v-for="n in 12">{{n}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in bondStore.finalYear + 1">
          <td>{{ bondStore.dates[0].getFullYear() + m -1 }}</td>
          <td v-for="i in 12">
            <div v-if="(m < 2 && i < bondStore.dates[0].getMonth()+1) || (m == bondStore.finalYear + 1 && i > bondStore.dates[bondStore.finalYear*12].getMonth())" style="width: 7em; text-align: center;">-</div>
            <div v-else style="width: 7em;">{{bondStore.currency}}{{ currencyFormatter.format(bondStore.runningCalcs[(m-1)*12 + i - bondStore.dates[0].getMonth()].capital) }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {ref, reactive, computed, watch, watchEffect, onMounted} from 'vue'
import LineChart from '../components/LineChart.vue';
import { bondStore, dateToMonth } from '../Stores/bond';

const currencyFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const adHocToggles = reactive({
  adHocPayments: false,
  interestRates: false,
  bondPayments: false,
  runningCapital: false
})

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

// const dateToMonth = (_date) => {
//   return _date.toISOString().split('T')[0].split('-').slice(0, 2).join('-')
// }

// const bond = reactive({
//   currency: "$",
//   loanAmount: 1000000,
//   interestRate: 5,
//   loanPeriod: 20,
//   actualPayment: null,
//   startingDate: dateToMonth(new Date()),
//   dates: computed(() => {
//     const _startDate = new Date(bond.startingDate)
//     const _startMonth = _startDate.getMonth()

//     const _datesArray = Array.from({length: 60 * 12}, (x, i) => {
//       const _currentMonth = new Date(_startDate)
//       _currentMonth.setMonth(_startMonth + i)
//       return _currentMonth
//     })

//     return _datesArray
//   }),
//   monthlyInterest:  computed(() => {
//     return bond.interestRate/1200
//   }),
//   periodInMonths: computed(() => {
//     return bond.loanPeriod*12
//   }),
//   minPayment: computed(() => {
//     const minPayment_ = (bond.loanAmount*bond.monthlyInterest)/(1-1/((1+bond.monthlyInterest)**bond.periodInMonths))
//     return minPayment_
//   }),
//   adHocPayments: Array.from({length: 60*12+1}, (x) => null),
//   adHocInterest: Array.from({length: 60*12+1}, (x) => null),
//   adHocMonthlyPayments: Array.from({length: 60*12+1}, (x) => null),
//   duration: "?! Something Went Wrong !?",
//   finalPayment: null,
//   finalYear: 60,
//   totalContribution: null,
//   runningCalcs: Array.from({length: 60*12 + 1}, (x) => {
//     return {
//       annualInterest: null,
//       monthlyInterest: null,
//       payment: null,
//       capital: null,
//     }
//   }),
// })

const chartData = reactive({
  labels: Array.from({length: bondStore.finalYear * 12}, (x, i) => i),
  datasets: [
    {
      label: "Loan Capital",
      data: Array.from({length: bondStore.loanPeriod * 12}, (x) => bondStore.loanAmount),
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
    if (bondStore.adHocMonthlyPayments[i]) {
      bondStore.runningCalcs[i].payment = bondStore.adHocMonthlyPayments[i]
    } else if (i == 0) {
      bondStore.runningCalcs[i].payment = bondStore.actualPayment ? bondStore.actualPayment : bondStore.minPayment
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
    bondStore.finalPayment = " INFINITE"
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
  console.log(bondStore.runningCalcs)
}

</script>

<style scoped>

th {
  border-bottom: 1px solid black;
}



  
</style>


