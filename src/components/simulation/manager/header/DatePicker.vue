<template>
  <el-date-picker
      style="max-width: 100%;"
      v-model="date"
      type="datetimerange"
      start-placeholder="Start date"
      end-placeholder="End date"
      format="YYYY-MM-DD HH:mm:ss"
      date-format="YYYY/MM/DD ddd"
      time-format="A hh:mm:ss"
      :shortcuts="shortcuts"
      @change="handleChange"
  />
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import _ from "lodash";

const simulationStore = useSimulationStore();
const {setInterval} = simulationStore;
const {interval} = storeToRefs(simulationStore);
const date = ref(_.cloneDeep(interval.value));

const handleChange = () => {
  setInterval(date.value);
};

const shortcuts = [
  {
    text: '过去一周',
    value: () => {
      const start = new Date();
      const end = new Date();
      end.setHours(end.getHours() + 1);
      return [start, end];
    },
  },
  {
    text: '过去一天',
    value: () => {
      const start = new Date();
      const end = new Date();
      start.setDate(start.getDate() - 1);
      return [start, end];
    },
  },
  {
    text: '过去一小时',
    value: () => {
      const start = new Date();
      const end = new Date();
      start.setHours(start.getHours() - 1);
      return [start, end];
    },
  },
  {
    text: '未来一小时',
    value: () => {
      const start = new Date();
      const end = new Date();
      end.setHours(end.getHours() + 1);
      return [start, end];
    },
  },
  {
    text: '未来一天',
    value: () => {
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 1);
      return [start, end];
    },
  },
  {
    text: '未来一周',
    value: () => {
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 7);
      return [start, end];
    },
  },
];

</script>

<style scoped lang="less">

</style>
