<template>
  <div style="display: flex; flex-direction: column; padding: 1em;">
    <div style="display: flex; justify-content: space-around;">
      <div>
        <label for="loanAmount">Loan Amount: {{bond.currency}}</label>
        <input id="loanAmount" type="number" min="1" v-model.lazy="bond.loanAmount" style="width: 7em;">
      </div>
      <div>
        <label for="interestRate">Interest Rate: </label>
        <input id="interestRate" type="number" min="1" max="100" v-model.lazy="bond.interestRate" style="width: 3em; text-align: end;">
        <span>%</span>
      </div>
      <div>
        <label for="loanPeriod">Loan Period: </label>
        <input id="loanPeriod" type="number" min="1" max="720" v-model.lazy="bond.loanPeriod" style="width: 3em; text-align: end;">
        <span>Years</span>
      </div>
    </div>
    <div style="display: flex; justify-content: space-around;">
      <div>
        <label for="MinPayment">Min Monthly Payment: {{bond.currency}}</label>
        <span>{{ bond.minPayment }}</span>
      </div>
      <div>
        <label for="ActPayment">Actual Monthly Payment: {{bond.currency}}</label>
        <input id="interestRate" type="number" min="1" :placeholder="bond.minPayment" v-model.lazy="bond.actualPayment">
      </div>
    </div>
    <div>
      <label for="LoanPayPeriod">Loan to be paid off in: </label>
      <span>{{bond.duration}}</span>
    </div>
    <div>
      <label for="LastPayment">Last payment amount: </label>
      <span>{{bond.currency}}{{bond.finalPayment}}</span>
    </div>
    <div>
      <label for="TotalAmount">Total amount paid over period of load: </label>
      <span>${{bond.totalContribution}}</span>
    </div>
  </div>
  <!-- <button @click="buttonPress">Press Me!</button> -->
  <canvas id="myChart"></canvas>
  <!-- <div>______________________________________________</div>
  <table>
    <thead>
      <tr>
        <th colspan="13">AD HOC PAYMENTS</th>
      </tr>
      <tr>
        <th colspan="13">Enter any additional payments which you make into your bond account. Loans from it are entered as negative numbers.</th>
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
      <tr v-for="m in bond.finalYear">
        <td>{{ m }}</td>
        <td v-for="i in 12">
          <input type="number" v-model="bond.adHocPayments[(m-1)*12 + i]" placeholder="0" style="width: 5em;">
        </td>
      </tr>
    </tbody>
  </table>
  <div>______________________________________________</div>
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
      <tr v-for="m in bond.finalYear">
        <td>{{ m }}</td>
        <td v-for="i in 12">
          <input type="number" v-model="bond.adHocInterest[(m-1)*12 + i]" :placeholder="bond.runningCalcs[(m-1)*12 + i].annualInterest" style="width: 5em;">
        </td>
      </tr>
    </tbody>
  </table>
  <div>______________________________________________</div>
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
      <tr v-for="m in bond.finalYear">
        <td>{{ m }}</td>
        <td v-for="i in 12">
          <input type="number" v-model="bond.adHocMonthlyPayments[(m-1)*12 + i]" :placeholder="bond.runningCalcs[(m-1)*12 + i].payment" style="width: 5em;">
        </td>
      </tr>
    </tbody>
  </table>
  <div>______________________________________________</div>
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
      <tr v-for="m in bond.finalYear">
        <td>{{ m }}</td>
        <td v-for="i in 12">
          <div style="width: 7em;">{{ currencyFormatter.format(bond.runningCalcs[(m-1)*12 + i].capital) }}</div>
        </td>
      </tr>
    </tbody>
  </table> -->
  
</template>

<script setup>
import {ref, reactive, computed, watch, watchEffect, onMounted} from 'vue'
import Chart from 'chart.js/auto'

onMounted(() => {
  const ctx = document.getElementById('myChart');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
})



const currencyFormatter = new Intl.NumberFormat('en-US')

const bond = reactive({
  currency: "$",
  loanAmount: 48000,
  interestRate: 1,
  loanPeriod: 5,
  actualPayment: null,
  monthlyInterest:  computed(() => {
    return bond.interestRate/1200
  }),
  periodInMonths: computed(() => {
    return bond.loanPeriod*12
  }),
  minPayment: computed(() => {
    const minPayment_ = (bond.loanAmount*bond.monthlyInterest)/(1-1/((1+bond.monthlyInterest)**bond.periodInMonths))
    return minPayment_
  }),
  adHocPayments: Array.from({length: 60*12+1}, (x) => null),
  adHocInterest: Array.from({length: 60*12+1}, (x) => null),
  adHocMonthlyPayments: Array.from({length: 60*12+1}, (x) => null),
  duration: "?! Something Went Wrong !?",
  finalPayment: null,
  finalYear: 60*12+1,
  totalContribution: null,
  runningCalcs: Array.from({length: 60*12 + 1}, (x) => {
    return {
      annualInterest: null,
      monthlyInterest: null,
      payment: null,
      capital: null,
    }
  }),
})

const parseCalcs = () => {
  bond.totalContribution = 0
  bond.runningCalcs.forEach((x, i) => {
    // interest calcs
    if (bond.adHocInterest[i]) {
      bond.runningCalcs[i].annualInterest = bond.adHocInterest[i]
    } else if (i == 0) {
      bond.runningCalcs[i].annualInterest = bond.interestRate
    } else {
      bond.runningCalcs[i].annualInterest = bond.runningCalcs[i-1].annualInterest
    }
    bond.runningCalcs[i].monthlyInterest = bond.runningCalcs[i].annualInterest/1200

    // payment calcs
    if (bond.adHocMonthlyPayments[i]) {
      bond.runningCalcs[i].payment = bond.adHocMonthlyPayments[i]
    } else if (i == 0) {
      bond.runningCalcs[i].payment = bond.actualPayment ? bond.actualPayment : bond.minPayment
    } else if (bond.runningCalcs[i-1].capital*(1 + bond.runningCalcs[i].monthlyInterest) < bond.runningCalcs[i-1].payment) {
      bond.runningCalcs[i].payment = bond.runningCalcs[i-1].capital*(1 + bond.runningCalcs[i].monthlyInterest)
    } else {
      bond.runningCalcs[i].payment = bond.runningCalcs[i-1].payment
    }

    //running capital
    if (i == 0) {
      bond.runningCalcs[i].capital = bond.loanAmount
    } else {
      bond.runningCalcs[i].capital = bond.runningCalcs[i-1].capital*(1 + bond.runningCalcs[i].monthlyInterest) - bond.runningCalcs[i].payment - bond.adHocPayments[i]
    }

    // total contribution tally
    if (i > 0 && i < 60*12+1) {
      bond.totalContribution += Number(bond.runningCalcs[i].payment) + Number(bond.adHocPayments[i])
    }
  })

  // last payment month and amount
  const lastMonth = bond.runningCalcs.findIndex((x) => x.capital <= 0)
  if(lastMonth == -1) {
    bond.duration = "NEVER (more than 60 years!)"
    bond.finalPayment = " INFINITE"
    bond.finalYear = 60
  } else {
    const _years = Math.floor(lastMonth/12)
    const _months = lastMonth%12
    const _monthTerm = _months ==1 ? "month" : "months"
    bond.duration = `${_years} years and ${_months} ${_monthTerm}`
    bond.finalPayment = bond.runningCalcs[lastMonth].payment
    bond.finalYear = _months > 0 ? _years + 1 : _years
  }

}

watchEffect(() => parseCalcs())

const buttonPress = () => {
  console.log(bond.runningCalcs)
}

</script>

<style scoped>

th {
  border-bottom: 1px solid black;
}



  
</style>

<!-- Pseudo code for calculating the running capital
  =Prior months capital * (1 + monthly interest for current month ) - bond payment for current month - ad-hoc payment for current month
  =AJ295*(1+AO149)-Y220-Y83
-->


<!-- Pseudo code for calculating the last payment date in excel, might be useful later...
  =IF(running capital for the month prior > 0 , IF(running capital for the current month < 0 , monthly payment -  negative running capital for the current month , monthly payment) , 0)
  =IF(AI300>0,IF(AJ300<0,AJ224+AJ300,AJ224),0)
-->

