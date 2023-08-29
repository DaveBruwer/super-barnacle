<template>
  <div style="display: flex; flex-direction: column; padding: 1em;">
    <div style="display: flex; justify-content: space-around;">
      <div>
        <label for="loanAmount">Loan Amount: {{bond.currency}}</label>
        <input id="loanAmount" type="number" min="1" v-model="bond.loanAmount" style="width: 7em;">
      </div>
      <div>
        <label for="interestRate">Interest Rate: </label>
        <input id="interestRate" type="number" min="1" max="100" v-model="bond.interestRate" style="width: 3em; text-align: end;">
        <span>%</span>
      </div>
      <div>
        <label for="loanPeriod">Loan Period: </label>
        <input id="loanPeriod" type="number" min="1" max="720" v-model="bond.loanPeriod" style="width: 3em; text-align: end;">
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
        <input id="interestRate" type="number" min="1" :placeholder="bond.minPayment" v-model="bond.actualPayment">
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
  <table>
    <tr>
      <th>1</th>
      <th>2</th>
      <th>3</th>
      <th>4</th>
      <th>5</th>
      <th>6</th>
      <th>7</th>
      <th>8</th>
      <th>9</th>
      <th>10</th>
      <th>11</th>
      <th>12</th>
    </tr>
    <tr>
      <td>1</td>
      <td>
        <input type="number">
        <div>something else</div>
      </td>
      <td>3</td>
    </tr>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>3</td>
    </tr>
  </table>
</template>

<script setup>
import {ref, reactive, computed, watch, watchEffect} from 'vue'

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
    return currencyFormatter.format(minPayment_)
  }),
  adHocPayments: Array.from({length: 60*12}, (x) => null),
  adHocInterest: Array.from({length: 60*12}, (x) => null),
  annualInterestByMonth: Array.from({length: 60*12}, (x) => null),
  monthlyInterestByMonth: Array.from({length: 60*12}, (x) => null),
  adHocMonthlyPayments: Array.from({length: 60*12}, (x) => null),
  bondPaymentsByMonth: Array.from({length: 60*12}, (x) => null),

})

const parseInterest = () => {
  bond.annualInterestByMonth.forEach((x, i) => {
    if (bond.adHocInterest[i]) {
      bond.annualInterestByMonth[i] = bond.adHocInterest[i]
    } else if (i == 0) {
      bond.annualInterestByMonth[i] = bond.interestRate
    } else {
      bond.annualInterestByMonth[i] = bond.annualInterestByMonth[i-1]
    }
  })
  bond.monthlyInterestByMonth = bond.annualInterestByMonth.map((x)=>x/1200)
}

const parsePaymentst = () => {
  bond.bondPaymentsByMonth.forEach((x, i) => {
    if (bond.adHocMonthlyPayments[i]) {
      bond.bondPaymentsByMonth[i] = bond.adHocMonthlyPayments[i]
    } else if (i == 0) {
      bond.bondPaymentsByMonth[i] = bond.actualPayment ? bond.actualPayment : bond.minPayment
    } else {
      bond.bondPaymentsByMonth[i] = bond.bondPaymentsByMonth[i-1]
    }
  })
}

watchEffect(() => parseInterest())
watchEffect(() => parsePaymentst())

const runningCapital = computed(() => {
  let _runningCapital = Array.from({length: 60*12}, (x) => 0)

  _runningCapital.forEach((x, i) => {
    if (i == 0) {
      _runningCapital[i] = bond.loanAmount
    } else {
      _runningCapital[i] = _runningCapital[i-1]*(1 + bond.monthlyInterestByMonth[i]) - bond.bondPaymentsByMonth[i] - bond.adHocPayments[i]
    }
  })
  return _runningCapital
})

console.log(runningCapital.value)

</script>

<style scoped>

th {
  border-bottom: 1px solid black;
}

td {
  border-bottom: 1px solid black;
}

tr {
  border: 1px solid red;
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