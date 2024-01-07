// router
import BasicLoan from "../views/BasicLoanView.vue"
import BasicLoan2 from "../views/BasicLoan2View.vue"
import BasicLoan3 from "../components/BasicLoan.vue"
// import TestPage from "../components/TestPage.vue"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    name: "Home",
    component: BasicLoan3,
  },
  {
    path: "/basicloan",
    name: "BasicLoan",
    component: BasicLoan,
  },
  {
    path: "/basicloan2",
    name: "BasicLoan2",
    component: BasicLoan2,
  },
  {
    path: "/basicloan3",
    name: "BasicLoan3",
    component: BasicLoan3,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
