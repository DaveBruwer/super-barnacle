<template>
  <div class="m-2 flex justify-content-center align-content-center">
    <div
      class="w-full flex flex-column justify-content-center"
      style="max-width: 60rem"
    >
      <div
        class="flex justify-content-between align-items-center align-content-center"
      >
        <div>
          <div
            v-if="showEditName"
            class="flex justify-content-between align-items-center align-content-center"
          >
            <h1>
              <i :class="homeLoanProps.icon" style="font-size: 2rem" />
            </h1>
            <InputText v-model.lazy="bond.name" />
            <Button
              @click="
                () => {
                  showEditName = false
                }
              "
              icon="pi pi-check"
              aria-label="Save Name"
              severity="secondary"
              class="h-2rem m-1"
            />
          </div>
          <div
            v-else
            class="flex justify-content-between align-items-center align-content-center"
          >
            <h1>
              <i :class="homeLoanProps.icon" style="font-size: 2rem" />
              {{ bond.name }}
            </h1>
            <Button
              @click="
                () => {
                  showEditName = true
                }
              "
              icon="pi pi-pencil"
              aria-label="Edit name"
              severity="secondary"
              text
              class="h-2rem m-1"
            />
          </div>
        </div>
        <Button
          @click="saveLoan"
          :disabled="!unSaved"
          icon="pi pi-save"
          aria-label="Save"
          class="h-2rem"
        />
      </div>
      <div
        class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around"
      >
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="purchase-price" class="font-bold block">
            Purchase Price:
          </label>
          <InputNumber
            v-model.lazy="homeLoanProps.asset.purchasePrice"
            inputId="purchase-price"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            :step="50000"
          />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="deposit" class="font-bold block"> Deposit: </label>
          <InputNumber
            v-model.lazy="homeLoanProps.asset.deposit"
            inputId="deposit"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            :step="5000"
          />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="renovation-cost" class="font-bold block">
            Renovation Cost:
          </label>
          <InputNumber
            v-model.lazy="homeLoanProps.asset.renovationCost"
            inputId="renovation-cost"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            :step="5000"
          />
        </div>
      </div>
      <Divider align="left"> Loan </Divider>
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
            disabled
            input-class="opacity-100"
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
      <Divider align="left"> Monthly Expenses </Divider>
      <div
        class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around"
      >
        <div class="w-14rem m-1">
          <label for="actualPayment" class="font-bold block">
            Loan Payment:</label
          >
          <InputNumber
            v-model.lazy="bond.actualPayment"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            inputId="actualPayment"
            disabled
            input-class="opacity-100"
          />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="rates-taxes" class="font-bold block">
            Rates & Taxes:
          </label>
          <InputNumber
            v-model.lazy="homeLoanProps.asset.ratesTaxes"
            inputId="rates-taxes"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            :step="500"
          />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="insurance" class="font-bold block"> Insurance: </label>
          <InputNumber
            v-model.lazy="homeLoanProps.asset.insurance"
            inputId="insurance"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            :step="500"
          />
        </div>
      </div>
      <div
        class="flex flex-column md:flex-row flex-wrap justify-content-around align-content-around"
      >
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="levies" class="font-bold block"> Levies / HOA: </label>
          <InputNumber
            v-model.lazy="homeLoanProps.asset.levies"
            inputId="levies"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            :step="500"
          />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="maintenance" class="font-bold block">
            Maintenance:
          </label>
          <InputNumber
            v-model.lazy="homeLoanProps.asset.maintenance"
            inputId="maintenance"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            :step="500"
          />
        </div>
        <div class="w-14rem m-1 md:mx-6 lg:mx-1">
          <label for="other" class="font-bold block"> Other: </label>
          <InputNumber
            v-model.lazy="homeLoanProps.asset.other"
            inputId="other"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            :step="500"
          />
        </div>
      </div>
      <div class="m-0 flex justify-content-start flex-wrap">
        <div class="mx-2 font-bold text-lg">
          <label for="minPayment" class=""> Total Monthly Expenses: </label>
          <InputNumber
            :input-class="boldBlendedInput"
            v-model.lazy="totalMonthlyExpenses"
            mode="currency"
            :currency="bond.currency.code"
            locale="en-US"
            disabled
            inputId="minPayment"
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
          <ColumnGroup type="header">
            <Row>
              <Column header="Year" :rowspan="2" :colspan="2" />
              <Column header="Opening" :colspan="2" />
              <Column header="Closing" :colspan="2" />
            </Row>
            <Row>
              <Column header="Loan Balance" />
              <Column header="Equity" />
              <Column header="Loan Balance" />
              <Column header="Equity" />
            </Row>
          </ColumnGroup>
          <Column expander style="width: 4rem"></Column>
          <Column field="year"></Column>
          <Column field="startingCapital">
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
          <Column field="startingEquity">
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
          <Column field="endingCapital">
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
          <Column field="endingEquity">
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
              <Column field="interest" header="Interest Rate">
                <template #body="{ data, field }">
                  <InputNumber
                    input-class="w-5rem"
                    v-model.lazy="data[field]"
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
                    v-model.lazy="data[field]"
                    mode="decimal"
                    :minFractionDigits="2"
                    :min="0"
                    inputId="interestRate"
                    suffix="%"
                    :highlightOnFocus="true"
                    :step="1"
                  />
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
                      :highlightOnFocus="true"
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
                      :highlightOnFocus="true"
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
              <Column field="assetValue" header="Home Value">
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
                      icon="pi pi-sort-up"
                      @click="resetHomeValue(data.monthIndex)"
                      title="Match Previous Value"
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
                      :step="5000"
                      :highlightOnFocus="true"
                    />
                    <Button
                      icon="pi pi-sort-up"
                      @click="resetHomeValue(data.monthIndex)"
                      title="Match Previous Value"
                    />
                  </InputGroup>
                </template>
              </Column>
              <Column field="endingCap" header="Loan Balance">
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
              <Column field="endingEquity" header="Equity">
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
import { ref, computed, watch, onMounted } from "vue"
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

import { useRouter } from "vue-router"
import { miscStore } from "../stores/miscStore"
import { homeLoanProps } from "../stores/loanStore"
import { auth, db } from "../firebase"
import { doc, setDoc } from "firebase/firestore"
import currencies from "../assets/currencies.json"
import deepCloneBond from "../assets/deepCloneBond.js"
import PrimeChart from "../components/PrimeChart.vue"

// PrimeVue imports...
import InputText from "primevue/inputtext"
import InputNumber from "primevue/inputnumber"
import InputGroup from "primevue/inputgroup"
import Button from "primevue/button"
import Dropdown from "primevue/dropdown"
import Calendar from "primevue/calendar"
import Fieldset from "primevue/fieldset"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import ColumnGroup from "primevue/columngroup"
import Row from "primevue/row"
import Divider from "primevue/divider"

const router = useRouter()

onMounted(() => {
  watch(
    () => authStore.user,
    () => {
      if (homeLoanProps.value.saved === false && authStore.user) {
        bond.currency = authStore.user.defaultCurrency
      }
    },
    { immediate: true }
  )
})

const showEditName = ref(false)

// COMPONENT VARIABLES
const expandedRows = ref([])
const initLoanProps = ref(null)
initLoanProps.value = deepCloneBond(homeLoanProps.value.bond)
const bond = homeLoanProps.value.bond

const assetValue = computed(() => {
  // console.log(homeLoanProps.value.asset.assetValue)
  // console.log(homeLoanProps.value.asset.customValue)
  let mostRecentValue =
    homeLoanProps.value.asset.purchasePrice +
    homeLoanProps.value.asset.renovationCost
  // console.log(mostRecentValue)
  // console.log(homeLoanProps.value.asset.assetValue)
  // console.log(homeLoanProps.value.asset.customValue)
  return homeLoanProps.value.asset.assetValue.map((val, i) => {
    if (!homeLoanProps.value.asset.customValue[i]) {
      return mostRecentValue
    } else {
      mostRecentValue = val
      return val
    }
  })
})

bond.loanAmount = computed(
  () =>
    homeLoanProps.value.asset.purchasePrice +
    homeLoanProps.value.asset.renovationCost -
    homeLoanProps.value.asset.deposit
)

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
        label: "Equity",
        data: Array.from(
          monthlyFigures.value,
          (x, i) => assetValue.value[i] - x.endingCap
        ),
        borderColor: "#F4D03F",
        backgroundColor: "#F7DC6F80",
      },
      {
        label: "Loan Balance",
        data: Array.from(monthlyFigures.value, (x) => x.endingCap),
        borderColor: "#318dcc",
        backgroundColor: "#245a7f",
      },
      {
        label: "Original Loan Balance",
        data: Array.from(defaultFigures.value, (x) => x.endingCap),
        fill: false,
        borderDash: [2],
        borderWidth: 2,
        borderColor: "#c75069",
        backgroundColor: "#893b4b",
      },
    ],
  }
})

const dataTableArray = computed(() => {
  let _dataTableArray = []
  monthlyFigures.value.forEach((month, i) => {
    // if it is NOT the first month of the given year, do this:
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
        assetValue: assetValue.value[i],
        startingEquity: assetValue.value[i] - month.startingCap,
        endingEquity: assetValue.value[i] - month.endingCap,
      })
      _dataTableArray[_dataTableArray.length - 1].totalContributions =
        _dataTableArray[_dataTableArray.length - 1].totalContributions +
        month.adHocPayment +
        month.payment
      _dataTableArray[_dataTableArray.length - 1].endingCapital =
        month.endingCap
      _dataTableArray[_dataTableArray.length - 1].endingEquity =
        assetValue.value[i] - month.endingCap
      _dataTableArray[_dataTableArray.length - 1].assetValue =
        assetValue.value[i]
    } else {
      // else, if it IS the FIRST month of any year, do this:
      _dataTableArray.push({
        year: month.year,
        totalContributions: month.adHocPayment + month.payment,
        endingCapital: month.endingCap,
        startingCapital: month.startingCap,
        assetValue: assetValue.value[i],
        startingEquity: assetValue.value[i] - month.startingCap,
        endingEquity: assetValue.value[i] - month.endingCap,
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
            assetValue: assetValue.value[i],
            startingEquity: assetValue.value[i] - month.startingCap,
            endingEquity: assetValue.value[i] - month.endingCap,
          },
        ],
      })
    }
  })
  return _dataTableArray
})

const totalMonthlyExpenses = computed(() => {
  return (
    homeLoanProps.value.asset.ratesTaxes +
    homeLoanProps.value.asset.insurance +
    homeLoanProps.value.asset.levies +
    homeLoanProps.value.asset.maintenance +
    homeLoanProps.value.asset.other +
    bond.actualPayment
  )
})

const unSaved = computed(() => {
  // const initBondJSON = ref(null)

  // const bond = homeLoanProps.value.bond
  try {
    if (authStore.userLoans[bond.name]) {
      const initBondJSON = JSON.stringify(authStore.userLoans[bond.name].bond)
      const bondJSON = JSON.stringify(homeLoanProps.value.bond)
      const initAssetJSON = JSON.stringify(authStore.userLoans[bond.name].asset)
      const assetJSON = JSON.stringify(homeLoanProps.value.asset)
      // console.log(JSON.stringify(authStore.userLoans[bond.name].asset))
      // console.log(JSON.stringify(homeLoanProps.value.asset))
      console.log(initBondJSON === initBondJSON)

      if (initBondJSON === bondJSON && initAssetJSON === assetJSON) {
        return false
      }
    }
  } catch (error) {
    console.log(error)
  }
  return true
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
      case "assetValue":
        homeLoanProps.value.asset.assetValue[i] = newValue
        homeLoanProps.value.asset.customValue[i] = 1
        break
      default:
        console.log("Change field not regocnised: ", field)
    }
  } else {
    console.log("no change")
  }
}

function resetHomeValue(i) {
  homeLoanProps.value.asset.customValue[i] = 0
  homeLoanProps.value.asset.assetValue[i] = 0
}

async function saveLoan() {
  if (!auth.currentUser) {
    router.push("/Login")
  } else {
    miscStore.progressSpinnerActive = true

    if (!authStore.userLoans[bond.name]) {
      authStore.userLoans[bond.name] = {
        route: homeLoanProps.value.route,
        saved: true,
        icon: homeLoanProps.value.icon,
        asset: homeLoanProps.value.asset,
        bond,
      }
    } else {
      authStore.userLoans[bond.name] = deepCloneBond(homeLoanProps.value)
    }

    await setDoc(doc(db, "Users", auth.currentUser.uid, "Loans", bond.name), {
      route: homeLoanProps.value.route,
      saved: true,
      icon: homeLoanProps.value.icon,
      asset: homeLoanProps.value.asset,
      bond,
    })
      .then(() => {
        console.log("Loan saved to database.")
      })
      .catch((error) => {
        console.log("Error saving loan to database:")
        console.log(error)
      })
    miscStore.progressSpinnerActive = false
  }
}

// CLASSES

const blendedInput = "w-8rem opacity-100 bg-transparent border-transparent"
const boldBlendedInput = blendedInput + " font-bold"
</script>

<style></style>
