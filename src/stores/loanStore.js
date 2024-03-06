import { ref } from "vue"
import deepCloneBond from "../assets/deepCloneBond.js"

const defaultBasicLoanProps = {
  route: "/Basic",
  icon: "pi pi-chart-line",
  saved: false,
  bond: {
    name: "Basic Loan",
    currency: {
      symbol: "$",
      name: "US Dollar",
      decimal_digits: 2,
      rounding: 0,
      code: "USD",
      name_plural: "US dollars",
    },
    loanAmount: 500000,
    interestRate: 7,
    loanPeriod: 30,
    actualPayment: 3326.51,
    customPayment: false,
    startingDate: new Date(),
    adHocPayments: Array.from({ length: 60 * 12 + 1 }, () => 0),
    customPayments: Array.from({ length: 60 * 12 + 1 }, () => 0),
    adHocInterest: Array.from({ length: 60 * 12 + 1 }, () => null),
    adHocMonthlyPayments: Array.from({ length: 60 * 12 + 1 }, () => null),
  },
}

const defaultHomeLoanProps = {
  route: "/HomeLoan",
  icon: "pi pi-home",
  saved: false,
  asset: {
    purchasePrice: 750000,
    deposit: 150000,
    renovationCost: 0,
  },
  bond: {
    name: "Home Loan",
    currency: {
      symbol: "$",
      name: "US Dollar",
      decimal_digits: 2,
      rounding: 0,
      code: "USD",
      name_plural: "US dollars",
    },
    loanAmount: 600000,
    interestRate: 7,
    loanPeriod: 30,
    actualPayment: 3991.81,
    customPayment: false,
    startingDate: new Date(),
    adHocPayments: Array.from({ length: 60 * 12 + 1 }, () => 0),
    customPayments: Array.from({ length: 60 * 12 + 1 }, () => 0),
    adHocInterest: Array.from({ length: 60 * 12 + 1 }, () => null),
    adHocMonthlyPayments: Array.from({ length: 60 * 12 + 1 }, () => null),
  },
}

const basicLoanProps = ref(null)
basicLoanProps.value = deepCloneBond(defaultBasicLoanProps)

const homeLoanProps = ref(null)
homeLoanProps.value = deepCloneBond(defaultHomeLoanProps)

export { basicLoanProps, homeLoanProps }

export function resetLoanProps() {
  basicLoanProps.value = deepCloneBond(defaultBasicLoanProps)
}
