// router
import BasicLoan from "../components/BasicLoan.vue"
import { createRouter, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/",
    name: "Home",
    component: BasicLoan,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
