import { miscStore } from "../stores/miscStore"

export function whenMounted() {
  miscStore.progressSpinnerActive = false
  console.log("whenMounted")
}
