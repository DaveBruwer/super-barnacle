import { reactive, computed } from "vue";

export const bondStore = reactive({
  currency: "$",
  loanAmount: 500000,
  interestRate: 7,
  loanPeriod: 30,
  actualPayment: null,
  startingDate: dateToMonth(new Date()),
  dates: computed(() => {
    const _startDate = new Date(bondStore.startingDate)
    const _startMonth = _startDate.getMonth()

    const _datesArray = Array.from({length: 60 * 12}, (x, i) => {
      const _currentMonth = new Date(_startDate)
      _currentMonth.setMonth(_startMonth + i)
      return _currentMonth
    })

    return _datesArray
  }),
  monthlyInterest:  computed(() => {
    return bondStore.interestRate/1200
  }),
  periodInMonths: computed(() => {
    return bondStore.loanPeriod*12
  }),
  minPayment: computed(() => {
    const minPayment_ = (bondStore.loanAmount*bondStore.monthlyInterest)/(1-1/((1+bondStore.monthlyInterest)**bondStore.periodInMonths))
    return minPayment_
  }),
  adHocPayments: Array.from({length: 60*12+1}, (x) => null),
  adHocInterest: Array.from({length: 60*12+1}, (x) => null),
  adHocMonthlyPayments: Array.from({length: 60*12+1}, (x) => null),
  duration: "?! Something Went Wrong !?",
  finalPayment: null,
  finalYear: 60,
  totalContribution: null,
  runningCalcs: Array.from({length: 60*12 + 1}, (x) => {
    return {
      annualInterest: null,
      monthlyInterest: null,
      payment: null,
      capital: null,
    }
  })
})

export function dateToMonth(_date) {
  return _date.toISOString().split('T')[0].split('-').slice(0, 2).join('-')
}
