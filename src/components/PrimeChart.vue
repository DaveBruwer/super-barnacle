<template>
  <Chart :type="chartOptions.type" :data="props.chartData" :options="chartOptions.options" />
</template>

<script setup>
import Chart from "primevue/chart"

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

</script>

<style>
  
</style>