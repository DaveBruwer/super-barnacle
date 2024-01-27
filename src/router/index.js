// router
import LandingPage from "../components/LandingPage.vue"
import BasicLoan from "../components/BasicLoan.vue"
import ComingSoon from "../components/ComingSoon.vue"
import Register from "../components/RegisterPage.vue"
import Login from "../components/LoginPage.vue"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    name: "Home",
    component: LandingPage,
  },
  {
    path: "/Basic",
    name: "Basic",
    component: BasicLoan,
  },
  {
    path: "/HomeLoan",
    name: "HomeLoan",
    component: ComingSoon,
  },
  {
    path: "/CarLoan",
    name: "CarLoan",
    component: ComingSoon,
  },
  {
    path: "/HomeCost",
    name: "HomeCost",
    component: ComingSoon,
  },
  {
    path: "/CarCost",
    name: "CarCost",
    component: ComingSoon,
  },
  {
    path: "/RentalProperty",
    name: "RentalProperty",
    component: ComingSoon,
  },
  {
    path: "/HouseFlip",
    name: "HouseFlip",
    component: ComingSoon,
  },
  {
    path: "/PropDev",
    name: "PropDev",
    component: ComingSoon,
  },
  {
    path: "/Contact",
    name: "Contact",
    component: ComingSoon,
  },
  {
    path: "/Account",
    name: "Account",
    component: Login,
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  {
    path: "/Register",
    name: "Register",
    component: Register,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
