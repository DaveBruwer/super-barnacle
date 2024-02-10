import { reactive } from "vue"

export const miscStore = reactive({
  currentTheme: determineTheme(),
  progressSpinnerActive: false,
})

function determineTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "vela-blue"
    : "saga-blue"
}
