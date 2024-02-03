// router
import LandingPage from "../components/LandingPage.vue"
import BasicLoan from "../components/BasicLoan.vue"
import ComingSoon from "../components/ComingSoon.vue"
import Register from "../components/RegisterPage.vue"
import Login from "../components/LoginPage.vue"
import ResetPassword from "../components/ResetPasswordPage.vue"
import Account from "../components/AccountPage.vue"
import { createRouter, createWebHistory } from "vue-router"
import { auth } from "../firebase"
import { miscStore } from "../stores/miscStore"

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
    component: Account,
    beforeEnter: async (to, from, next) => {
      await auth.authStateReady().then(() => {
        if (!auth.currentUser) {
          next({ name: "Login" })
        } else {
          next()
        }
      })
    },
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
    beforeEnter: async (to, from, next) => {
      await auth.authStateReady().then(() => {
        if (auth.currentUser) {
          next({ name: "Account" })
        } else {
          next()
        }
      })
    },
  },
  {
    path: "/Register",
    name: "Register",
    component: Register,
    beforeEnter: async (to, from, next) => {
      await auth.authStateReady().then(() => {
        if (auth.currentUser) {
          next({ name: "Account" })
        } else {
          next()
        }
      })
    },
  },
  {
    path: "/ResetPassword",
    name: "ResetPassword",
    component: ResetPassword,
    beforeEnter: async (to, from, next) => {
      await auth.authStateReady().then(() => {
        if (auth.currentUser) {
          next({ name: "Account" })
        } else {
          next()
        }
      })
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  miscStore.progressSpinnerActive = true
  setTimeout(() => {
    next()
  }, 50)
})

router.afterEach(() => {
  miscStore.progressSpinnerActive = false
})

export default router
