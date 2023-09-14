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
        pointStyle: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                }
                return label;
              },
              title: function(context) {
                let title = context[0].label || '';
                if( !isNaN(title) ) {
                  const _year = Math.floor(title/12)
                  const _month = title%12
                  title = `${_year} yrs & ${_month} mnths`
                }
                
                return title;
              }
            }
          }
        }
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