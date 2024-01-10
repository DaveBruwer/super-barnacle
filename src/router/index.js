// router
import BasicLoan from "../components/BasicLoan.vue"
import ComingSoon from "../components/ComingSoon.vue"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    name: "Home",
    component: BasicLoan,
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
    component: ComingSoon,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
