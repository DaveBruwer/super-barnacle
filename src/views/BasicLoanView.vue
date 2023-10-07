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
            <th v-for="n in 12">{{n}}</th>
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
      <button @click="runningCapitalDialog.close()">Close</button>
    </dialog>
  </div>
</template>

<script setup>
import {ref, reactive, computed, watch, watchEffect, onMounted} from 'vue'
import LineChart from '../components/LineChart.vue';
import { bondStore, dateToMonth } from '../Stores/bond';

const currencyFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const adHocPaymentsDialog = ref()
const interestRatesDialog = ref()
const bondPaymentsDialog = ref()
const runningCapitalDialog = ref()

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


