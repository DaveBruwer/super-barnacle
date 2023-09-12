<template>
  <canvas id="myCanvas" ></canvas>
</template>

<script setup>

  import { Chart } from 'chart.js/auto';
  import { reactive, ref, onMounted, defineProps, watch } from 'vue';

  const props = defineProps({
    chartData: {
      type: Object,
      required: true
    }
  })

  let myChart

  onMounted(() => {
    const myCanvas = document.getElementById("myCanvas")
    
    myChart = new Chart(myCanvas, {
      type: 'line',
      options: {
        fill: true,
        tension: 0.25,
        pointStyle: false
      },
      data: props.chartData
    })
  })

  watch(props, () => {
    myChart.update()
  })

  
</script>

<style>
  
</style>