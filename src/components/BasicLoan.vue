<template>
  <div class="m-2 flex justify-content-center align-content-center">
    <div
      class="w-full flex flex-column justify-content-center"
      style="max-width: 60rem"
    >
      <div
        class="flex justify-content-between align-items-center align-content-center"
      >
        <h1>
          <i class="pi pi-chart-line" style="font-size: 2rem" />
          {{ props.bond.name }}
        </h1>
        <Button
          :disabled="unSaved"
          icon="pi pi-save"
          aria-label="Save"
          class="h-2rem"
        />
      </div>
      <div
        class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around"
      >
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="currencies" class="font-bold block"> Currency: </label>
          <Dropdown
            v-model.lazy="bond.currency"
            :options="Object.values(currencies)"
            optionLabel="code"
            inputId="currencies"
            class="w-14rem"
          />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="loan-amount" class="font-bold block">
            Loan Amount:
          </label>
          <InputNumber
            v-model.lazy="bond.loanAmount"
            inputId="loan-amount"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            :step="50000"
          />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="interestRate" class="font-bold block">
            Interest Rate:
          </label>
          <InputNumber
            style="width: 10rem"
            v-model.lazy="bond.interestRate"
            mode="decimal"
            :minFractionDigits="2"
            :min="0"
            inputId="interestRate"
            suffix="%"
          />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="loanPeriod" class="font-bold block"> Loan Period: </label>
          <InputNumber
            v-model.lazy="bond.loanPeriod"
            mode="decimal"
            :minFractionDigits="0"
            inputId="loanPeriod"
            suffix=" Yrs"
            :step="5"
          />
        </div>
      </div>
      <Divider align="left"> Repayments </Divider>
      <div
        class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around"
      >
        <div class="w-14rem m-1">
          <label for="actualPayment" class="font-bold block">
            Monthly Payment Amount: {{ bond.customPayment ? "" : "*" }}</label
          >
          <InputGroup>
            <InputNumber
              v-model.lazy="bond.actualPayment"
              mode="currency"
              :currency="bond.currency.code"
              locale="en-US"
              inputId="actualPayment"
              :step="100"
              :min="minPayment"
            />
            <Button
              icon="pi pi-refresh"
              @click="bond.actualPayment = minPayment"
              title="Reset to Min Payment"
            />
          </InputGroup>
        </div>
        <div class="w-14rem m-1">
          <label for="startDate" class="font-bold block">
            First Payment Month:
          </label>
          <Calendar
            v-model.lazy="bond.startingDate"
            view="month"
            dateFormat="MM yy"
            showIcon
          />
        </div>
      </div>
      <Divider align="left"> Insights </Divider>
      <div class="m-0 flex justify-content-evenly flex-wrap">
        <div class="mx-2">
          <label for="minPayment" class=""> Minimum monthly repayments: </label>
          <InputNumber
            :input-class="boldBlendedInput"
            v-model.lazy="minPayment"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            disabled
            inputId="minPayment"
          />
        </div>
        <div class="mx-2 my-2">
          Loan will be paid off in <b> {{ duration }} </b>.
        </div>
        <div class="mx-2 my-2">
          Last payment will be on <b> {{ finalMonthName }} {{ finalYear }} </b>.
        </div>
        <div class="mx-2">
          <label for="lastPayment" class="">
            Last payment amount will be:
          </label>
          <InputNumber
            :input-class="boldBlendedInput"
            v-model.lazy="finalPayment"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            disabled
            inputId="lastPayment"
          />
        </div>
        <div class="mx-2">
          <label for="totalPayments" class="">
            Total amount paid over the period of the loan:
          </label>
          <InputNumber
            :input-class="boldBlendedInput"
            v-model.lazy="totalContribution"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            disabled
            inputId="totalPayments"
          />
        </div>
      </div>
      <Divider align="left"> Balance </Divider>
      <div class="w-full card align-self-center">
        <PrimeChart
          ref="primaryChart"
          :chart-data="chartData"
          :currency-symbol="bond.currency.symbol"
        />
      </div>
      <Fieldset
        class="m-3 flex justify-content-center"
        legend="Advanced"
        :toggleable="true"
        :collapsed="true"
      >
        <DataTable
          v-model:expandedRows="expandedRows"
          :value="dataTableArray"
          tableStyle="min-width: 60rem"
        >
          <Column expander style="width: 4rem"></Column>
          <Column field="year" header="Year"></Column>
          <Column field="totalContributions" header="Contributions">
            <template #body="{ data, field }">
              <InputNumber
                :input-class="blendedInput"
                v-model.lazy="data[field]"
                mode="currency"
                :currency="bond.currency.code"
                locale="en-US"
                disabled
              />
            </template>
          </Column>
          <Column field="startingCapital" header="Opening Balance">
            <template #body="{ data, field }">
              <InputNumber
                :input-class="blendedInput"
                v-model.lazy="data[field]"
                mode="currency"
                :currency="bond.currency.code"
                locale="en-US"
                disabled
              />
            </template>
          </Column>
          <Column field="endingCapital" header="Closing Balance">
            <template #body="{ data, field }">
              <InputNumber
                :input-class="blendedInput"
                v-model.lazy="data[field]"
                mode="currency"
                :currency="bond.currency.code"
                locale="en-US"
                disabled
              />
            </template>
          </Column>
          <template #expansion="slotProps">
            <DataTable
              :value="slotProps.data.months"
              lazy
              edit-mode="cell"
              @cell-edit-complete="onCellEdit"
            >
              <Column field="date" header="Month" style="width: 7rem"></Column>
              <Column field="onceOffPayment" header="Once-off Payment">
                <template #body="{ data, field }">
                  <InputGroup class="w-8rem">
                    <InputNumber
                      v-model.lazy="data[field]"
                      mode="currency"
                      :currency="bond.currency.code"
                      locale="en-US"
                      :step="500"
                    />
                    <Button
                      icon="pi pi-delete-left"
                      @click="
                        resetOnceOffPayment(bond.adHocPayments, data.monthIndex)
                      "
                      title="Clear Payment"
                    />
                  </InputGroup>
                </template>
                <template #editor="{ data, field }">
                  <InputGroup class="w-8rem">
                    <InputNumber
                      v-model.lazy="data[field]"
                      mode="currency"
                      :currency="bond.currency.code"
                      locale="en-US"
                      :step="500"
                      highlightOnFocus="true"
                    />
                    <Button
                      icon="pi pi-delete-left"
                      @click="
                        resetOnceOffPayment(bond.adHocPayments, data.monthIndex)
                      "
                      title="Clear Payment"
                    />
                  </InputGroup>
                </template>
              </Column>
              <Column field="payment" header="Monthly Payments">
                <template #body="{ data, field }">
                  <InputGroup class="w-10rem">
                    <InputNumber
                      input-class="w-6rem"
                      v-model.lazy="data[field]"
                      mode="currency"
                      :currency="bond.currency.code"
                      locale="en-US"
                    />
                    <Button
                      icon="pi pi-sort-down"
                      @click="
                        resetMonthlyPayment(
                          bond.adHocMonthlyPayments,
                          bond.customPayments,
                          data.monthIndex
                        )
                      "
                      title="Match Minimum Payment"
                    />
                    <Button
                      icon="pi pi-sort-up"
                      @click="
                        matchMonthlyPayment(
                          bond.adHocMonthlyPayments,
                          bond.customPayments,
                          data.monthIndex,
                          monthlyFigures[data.monthIndex - 1].payment
                        )
                      "
                      title="Match Previous Payment"
                    />
                  </InputGroup>
                </template>
                <template #editor="{ data, field }">
                  <InputGroup class="w-10rem">
                    <InputNumber
                      input-class="w-6rem"
                      v-model.lazy="data[field]"
                      mode="currency"
                      :currency="bond.currency.code"
                      locale="en-US"
                      :step="100"
                      highlightOnFocus="true"
                    />
                    <Button
                      icon="pi pi-sort-down"
                      @click="
                        resetMonthlyPayment(
                          bond.adHocMonthlyPayments,
                          bond.customPayments,
                          data.monthIndex
                        )
                      "
                      title="Match Minimum Payment"
                    />
                    <Button
                      icon="pi pi-sort-up"
                      @click="
                        matchMonthlyPayment(
                          bond.adHocMonthlyPayments,
                          bond.customPayments,
                          data.monthIndex,
                          monthlyFigures[data.monthIndex - 1].payment
                        )
                      "
                      title="Match Previous Payment"
                    />
                  </InputGroup>
                </template>
              </Column>
              <Column field="interest" header="Interest Rate">
                <template #body="{ data, field }">
                  <InputNumber
                    input-class="w-5rem"
                    v-model="data[field]"
                    mode="decimal"
                    :minFractionDigits="2"
                    :min="0"
                    inputId="interestRate"
                    suffix="%"
                    :step="1"
                  />
                </template>
                <template #editor="{ data, field }">
                  <InputNumber
                    input-class="w-5rem"
                    v-model="data[field]"
                    mode="decimal"
                    :minFractionDigits="2"
                    :min="0"
                    inputId="interestRate"
                    suffix="%"
                    highlightOnFocus="true"
                    :step="1"
                  />
                </template>
              </Column>
              <Column field="startingCap" header="Opening Balance">
                <template #body="{ data, field }">
                  <InputNumber
                    :input-class="blendedInput"
                    v-model.lazy="data[field]"
                    mode="currency"
                    :currency="bond.currency.code"
                    locale="en-US"
                    disabled
                  />
                </template>
              </Column>
              <Column field="endingCap" header="Closing Balance">
                <template #body="{ data, field }">
                  <InputNumber
                    :input-class="blendedInput"
                    v-model.lazy="data[field]"
                    mode="currency"
                    :currency="bond.currency.code"
                    locale="en-US"
                    disabled
                  />
                </template>
              </Column>
            </DataTable>
          </template>
        </DataTable>
      </Fieldset>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, defineProps } from "vue"
import { authStore } from "../stores/authStore"
import {
  calcMinPayment,
  monthlyCalcs,
  basicCalcs,
  calcDuration,
  getMonthName,
  resetOnceOffPayment,
  resetMonthlyPayment,
  matchMonthlyPayment,
} from "../assets/LoanCalcs"

import currencies from "../assets/currencies.json"
import PrimeChart from "../components/PrimeChart.vue"

const props = defineProps({
  saved: {
    type: Boolean,
    default: false,
  },
  bond: {
    type: Object,
    default() {
      return {
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
        actualPayment: calcMinPayment(500000, 7, 30),
        customPayment: false,
        startingDate: new Date(),
        adHocPayments: Array.from({ length: 60 * 12 + 1 }, () => 0),
        customPayments: Array.from({ length: 60 * 12 + 1 }, () => 0),
        adHocInterest: Array.from({ length: 60 * 12 + 1 }, () => null),
        adHocMonthlyPayments: Array.from({ length: 60 * 12 + 1 }, () => null),
      }
    },
  },
})

onMounted(async () => {
  watch(
    () => authStore.user,
    () => {
      if (props.saved === false && authStore.user) {
        bond.currency = authStore.user.defaultCurrency
      }
    },
    { immediate: true }
  )
})

// PrimeVue imports...
import InputNumber from "primevue/inputnumber"
import InputGroup from "primevue/inputgroup"
import Button from "primevue/button"
import Dropdown from "primevue/dropdown"
import Calendar from "primevue/calendar"
import Fieldset from "primevue/fieldset"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Divider from "primevue/divider"

// COMPONENT VARIABLES
const expandedRows = ref([])
const bond = reactive({ ...props.bond })

//COMPUTED PROPERTIES
const minPayment = computed(() =>
  calcMinPayment(bond.loanAmount, bond.interestRate, bond.loanPeriod)
)
const monthlyFigures = computed(() => monthlyCalcs(bond))
const defaultFigures = computed(() => basicCalcs(bond))
const finalPayment = computed(
  () => monthlyFigures.value[monthlyFigures.value.length - 1].payment
)
const duration = computed(() => calcDuration(monthlyFigures.value.length))
const totalContribution = computed(
  () => monthlyFigures.value[monthlyFigures.value.length - 1].contribution
)
const finalMonth = computed(() =>
  monthlyFigures.value[monthlyFigures.value.length - 1].date.getMonth()
)
const finalMonthName = computed(() => getMonthName(finalMonth.value))
const finalYear = computed(() =>
  monthlyFigures.value[monthlyFigures.value.length - 1].date.getFullYear()
)
const chartData = computed(() => {
  return {
    labels: Array.from(defaultFigures.value, (x) => x.dateString),
    datasets: [
      {
        label: "Loan Balance",
        data: Array.from(monthlyFigures.value, (x) => x.endingCap),
      },
      {
        label: "Original Loan Balance",
        data: Array.from(defaultFigures.value, (x) => x.endingCap),
        fill: false,
        borderDash: [2],
        borderWidth: 2,
      },
    ],
  }
})

const dataTableArray = computed(() => {
  let _dataTableArray = []
  monthlyFigures.value.forEach((month, i) => {
    if (
      _dataTableArray.length > 0 &&
      _dataTableArray[_dataTableArray.length - 1].year === month.year
    ) {
      _dataTableArray[_dataTableArray.length - 1].months.push({
        onceOffPayment: month.adHocPayment,
        interest: month.annualInterest,
        startingCap: month.startingCap,
        capAfterInterest: month.capAfterInterest,
        endingCap: month.endingCap,
        contribution: month.contribution,
        date: month.dateString,
        payment: month.payment,
        monthIndex: i,
        minPayment: month.minPayment,
      })
      _dataTableArray[_dataTableArray.length - 1].totalContributions =
        _dataTableArray[_dataTableArray.length - 1].totalContributions +
        month.adHocPayment +
        month.payment
      _dataTableArray[_dataTableArray.length - 1].endingCapital =
        month.endingCap
    } else {
      _dataTableArray.push({
        year: month.year,
        totalContributions: month.adHocPayment + month.payment,
        endingCapital: month.endingCap,
        startingCapital: month.startingCap,
        months: [
          {
            onceOffPayment: month.adHocPayment,
            interest: month.annualInterest,
            startingCap: month.startingCap,
            capAfterInterest: month.capAfterInterest,
            endingCap: month.endingCap,
            contribution: month.contribution,
            date: month.dateString,
            payment: month.payment,
            monthIndex: i,
            minPayment: month.minPayment,
          },
        ],
      })
    }
  })
  return _dataTableArray
})

const unSaved = computed(() => {
  if (props.bond != bond) {
    return true
  }
  return false
})

//WATCHERS
watch(
  () => bond.actualPayment,
  (newPayment) => {
    if (isNaN(newPayment) || newPayment <= minPayment.value) {
      bond.actualPayment = minPayment.value
      bond.customPayment = false
      bond.customPayments.fill(0, 0)
    } else {
      bond.customPayment = true
      bond.adHocMonthlyPayments[0] = newPayment
      bond.customPayments.fill(1, 0)
    }
  }
)

watch(
  () => minPayment.value,
  () => {
    if (
      isNaN(bond.actualPayment) ||
      bond.actualPayment <= minPayment.value ||
      !bond.customPayment
    ) {
      bond.actualPayment = minPayment.value
      bond.customPayment = false
    }
  }
)

// METHODS
function onCellEdit(event) {
  let { data, newValue, value, field } = event

  if (Math.round(value * 100) / 100 != newValue) {
    const i = data.monthIndex

    switch (field) {
      case "payment":
        bond.adHocMonthlyPayments[i] = newValue
        bond.customPayments.fill(1, i)
        break
      case "interest":
        bond.adHocInterest[i] = newValue
        break
      case "onceOffPayment":
        bond.adHocPayments[i] = newValue
        break
      default:
        console.log("Change field not regocnised: ", field)
    }
  } else {
    console.log("no change")
  }
}

// CLASSES

const blendedInput = "w-8rem opacity-100 bg-transparent border-transparent"
const boldBlendedInput = blendedInput + " font-bold"
</script>

<style></style>
