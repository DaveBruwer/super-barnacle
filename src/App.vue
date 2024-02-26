<template>
  <div class="flex flex-column align-items-center">
    <dHeader />
    <div
      style="max-width: 60rem"
      class="m-2 w-full flex flex-column align-items-center"
    >
      <RouterView />
    </div>
  </div>
  <dialog ref="progressSpinnerModal" class="w-auto h-auto border-none">
    <div
      class="flex justify-content-center align-itmes-center align-content-center w-full h-full"
    >
      <div class="m-auto text-3xl flex flex-column">
        <img alt="logo" src="/LoanSim_Icon3.svg" height="40" class="mr-2" />
        <div class="m-4">Loading . . .</div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import dHeader from "./components/dHeader.vue"
import { miscStore } from "./stores/miscStore"
import { ref, watch, onMounted } from "vue"

const progressSpinnerModal = ref(null)

onMounted(() => {
  watch(
    () => miscStore.progressSpinnerActive,
    (val) => {
      if (val) {
        progressSpinnerModal.value.showModal()
      } else progressSpinnerModal.value.close()
    }
  )

  miscStore.progressSpinnerActive = false
})
</script>

<style scoped>
dialog {
  background-color: transparent;
}

dialog::backdrop {
  background-color: black;
  opacity: 0.5;
}
</style>
