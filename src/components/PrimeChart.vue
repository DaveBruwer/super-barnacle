<template>
  <Chart
    ref="chart"
    :type="chartOptions.type"
    :data="props.chartData"
    :options="chartOptions.options"
  />
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import Chart from "primevue/chart"

const chart = ref()

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  currencySymbol: {
    type: String,
    required: true,
  },
})

const chartOptions = {
  type: "line",
  options: {
    fill: true,
    tension: 0.25,
    pointStyle: false,
    scales: {
      y: {
        min: 0,
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value) {
            return props.currencySymbol + " " + value
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (context) {
            let title = context[0].label || ""
            if (!isNaN(title)) {
              const _year = Math.floor(title / 12)
              const _month = title % 12
              title = `${_year} yrs & ${_month} mnths`
            }

            return title
          },
        },
      },
    },
  },
}

onMounted(() => {
  const resizeHandler = {
    timeOut: null,
    execute: function () {
      if (this.timeOut) {
        clearTimeout(this.timeOut)
      }
      this.timeOut = setTimeout(chart.value.reinit(), 50)
    },
  }

  window.addEventListener("resize", resizeHandler.execute)

  watch(() => props.currencySymbol, chart.value.reinit)
})
</script>

<style></style>
