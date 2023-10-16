// router
import BasicLoan from '../views/BasicLoanView.vue'
import TestPage from '../components/TestPage.vue'
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TestPage
  },
  {
    path: '/',
    name: 'BasicLoan',
    component: BasicLoan
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router