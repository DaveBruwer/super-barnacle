<template>
  <div
    class="m-4 h-screen flex flex-column justify-content-start align-content-center align-items-center"
  >
    <img
      alt="LoanSim"
      src="/LoanSim_Logo1.svg"
      class="mr-2 w-full max-w-30rem"
    />
    <h2 class="w-auto">
      Understand, Forecast, and Track your loans in one place!
    </h2>
    <!--Card for the basic loan calculator page.-->
    <router-link to="/Basic">
      <Card class="mycard">
        <template #title
          ><i class="pi pi-chart-line" style="font-size: 2rem" /> Basic
        </template>
        <template #content>
          <p class="m-0">
            Like a basic, easy to use loan repayment calculator. But with so
            much more! Change the interest rate, monthly payment, or once-off
            payment at any month during the loan period to see how it affects
            the overall loan.
          </p>
        </template>
      </Card>
    </router-link>
    <Divider align="left"
      ><i class="pi pi-chart-line" /> Loan Simulators
    </Divider>
    <div
      class="flex flex-wrap justify-content-around align-content-around gap-3"
    >
      <!--Card for the home loan calculator page.-->
      <router-link to="/HomeLoan">
        <Card class="mycard">
          <template #title
            ><i class="pi pi-home" style="font-size: 2rem" /> Home
          </template>
          <template #content>
            <p class="m-0">
              A loan simulator specifically for Homes! Calculate affordability,
              and track equity over time.
            </p>
          </template>
        </Card>
      </router-link>
      <!--Card for the car loan calculator page.-->
      <router-link to="/CarLoan">
        <Card class="mycard">
          <template #title
            ><i class="pi pi-car" style="font-size: 2rem" /> Car
          </template>
          <template #content>
            <p class="m-0">
              A loan simulator specifically for buying a Car! Calculate cost of
              ownership, and track the value of the car vs. the loan balance and
              see the amount of equity in the asset.
            </p>
          </template>
        </Card>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import Card from "primevue/card"
import Divider from "primevue/divider"
import { whenMounted } from "../assets/onMounted"
import { onMounted } from "vue"

onMounted(() => {
  whenMounted()
})
</script>

<style>
a {
  text-decoration: none;
}

.mycard {
  width: 20em;
  height: 15em;
  border-radius: 5%;
  background-color: #245a7fff;
  border: solid 4px #318dccff;
  color: white;
}
</style>
