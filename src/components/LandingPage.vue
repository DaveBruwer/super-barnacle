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
    <!-- <Divider align="left"
      ><i class="pi pi-dollar" /> Cost of Ownership
    </Divider>
    <div
      class="flex flex-wrap justify-content-around align-content-around gap-3"
    >
      <router-link to="/HomeCost">
        <Card class="mycard">
          <template #title
            ><i class="pi pi-dollar" style="font-size: 1rem" /><i
              class="pi pi-home"
              style="font-size: 2rem"
            />
            Home
          </template>
          <template #content>
            <p class="m-0">
              Understand the total cost of buying that dream property. Mortgage
              repayments, rates & taxes, upkeep, etc.
            </p>
          </template>
        </Card>
      </router-link>
      <router-link to="/CarCost">
        <Card class="mycard">
          <template #title
            ><i class="pi pi-dollar" style="font-size: 1rem" /><i
              class="pi pi-car"
              style="font-size: 2rem"
            />
            Car
          </template>
          <template #content>
            <p class="m-0">
              Understand the total cost of buying that dream car. Loan
              repayments, insurance, upkeep, etc.
            </p>
          </template>
        </Card>
      </router-link>
    </div> -->
    <!-- <Divider align="left"><i class="pi pi-dollar" /> Cashflow </Divider>
    <div
      class="flex flex-wrap justify-content-around align-content-around gap-3"
    >
      <router-link to="/RentalProperty">
        <Card class="mycard">
          <template #title
            ><i class="pi pi-home" style="font-size: 2rem" /> Rental Property
          </template>
          <template #content>
            <p class="m-0">
              Keep track of any rental property! Compare the mortgage repayments
              with rental income, vacancy rate, etc.
            </p>
          </template>
        </Card>
      </router-link>
      <router-link to="/HouseFlip">
        <Card class="mycard">
          <template #title
            ><i class="pi pi-home" style="font-size: 2rem" /> House Flip
          </template>
          <template #content>
            <p class="m-0">
              Easily calculate what needs to be done to flip that property for a
              profit. Renovation costs, comp. prices, etc.
            </p>
          </template>
        </Card>
      </router-link>
    </div> -->
  </div>
</template>

<script setup>
import Card from "primevue/card"
import Divider from "primevue/divider"
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
