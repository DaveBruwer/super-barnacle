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
          <slot name="outOfRange" v-if="(m < 2 && i < props.startDate.getMonth()+1) || (m == props.finalYear + 1 && i > props.endDate.getMonth())" style="width: 5em;"></slot>
          <slot v-else ></slot>
          <input type="number" v-model="bond.adHocPayments[(m-1)*12 + i - props.startDate.getMonth()]" placeholder="0" style="width: 5em;">
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