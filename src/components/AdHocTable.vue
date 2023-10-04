<template>
  <table>
    <thead>
      <tr>
        <th colspan="13"><slot name="heading"></slot></th>
      </tr>
      <tr>
        <th colspan="13"><slot name="subHeading"></slot></th>
      </tr>
      <tr>
        <th></th>
        <th v-for="month in months">{{month}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="m in bondStore.finalYear + 1">
        <td>{{ bondStore.dates[0].getFullYear() + m-1 }}</td>
        <td v-for="i in 12">
          <div>
            <input v-if="(m < 2 && i < bondStore.dates[0].getMonth()+1) || (m == bondStore.finalYear + 1 && i > bondStore.dates[bondStore.finalYear*12].getMonth())" type="number" disabled="true" style="width: 5em;">
            <input v-else type="number" v-model="dataArray[(m-1)*12 + i]" :placeholder="bondStore.runningCalcs[(m-1)*12 + i - bondStore.dates[0].getMonth()].annualInterest" style="width: 5em;">
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>

import { defineProps } from 'vue';
import { bondStore } from '../Stores/bond';

const props = defineProps({
  finalYear: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  dataArray: {
    type: Array,
    required: true
  },
  isInput: {
    type: Boolean,
    default: false
  }
})

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  
</script>

<style>
  
</style>