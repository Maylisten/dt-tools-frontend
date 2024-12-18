<template>
  <div class="border-gray-200 border-2 rounded p-4 shadow-sm">
    <div class="mb-4 flex flex-row items-center justify-between" :class="{
      'text-primary-500': ifProcessing,
      'text-success-500': !ifProcessing,
    }">
      <span>{{ process.filename }}</span>
      <el-icon v-if="ifProcessing">
        <Loading class="animate-spin text-xl"/>
      </el-icon>
      <el-icon v-if="!ifProcessing">
        <SuccessFilled/>
      </el-icon>
    </div>
    <el-steps :active="process.status + 1" finish-status="success" simple>
      <el-step v-for="step of steps" :title="getStepTitle(step.value)" :key="step.index"/>
      <el-step :title="lastStepTitle"/>
    </el-steps>
  </div>

</template>

<script setup lang="ts">
import {Process, Step} from "@/types/Process.ts";
import {computed, toRefs} from "vue";
import {STEP_LABEL_MAP} from "@/const";
import {Loading, SuccessFilled} from "@element-plus/icons-vue";

const props = defineProps<{ process: Process }>();
const {process} = toRefs(props);

const lastStepTitle = `数据存储`;

const steps = process.value.steps.map((step, index) => ({
  index,
  value: step
}));

const ifProcessing = computed(() => process.value.status < process.value.steps.length);

const getStepTitle = (step: Step) => {
  return `${STEP_LABEL_MAP[step]}`;
};

</script>

<style scoped lang="less">

</style>
