<template>
  <Chart ref="chart" :type="chartOptions.type" :data="props.chartData" :options="chartOptions.options" />
</template>

<script setup>
import { ref } from "vue"
import Chart from "primevue/chart"

const chart = ref()

const reinit = function() {
  chart.value.reinit()
}
const refresh = function() {
  chart.value.refresh()
}

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const chartOptions = {
  type: "line",
  options: {
    fill: true,
    tension: 0.25,
    pointStyle: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: function(context) {
            let title = context[0].label || ""
            if( !isNaN(title) ) {
              const _year = Math.floor(title/12)
              const _month = title%12
              title = `${_year} yrs & ${_month} mnths`
            }
              
            return title
          }
        }
      }
    }
  }
}

defineExpose({
  reinit,
  refresh
})

</script>

<style>
  
</style>