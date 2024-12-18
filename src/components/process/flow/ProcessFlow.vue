<template>
  <el-timeline style="max-width: 600px">
    <el-timeline-item center placement="top">
      <div class="flex flex-row justify-between items-center gap-5">
        <span>数据读取</span>
        <div>
          <el-button type="primary" plain @click="addStep(0)"> + 添加处理步骤</el-button>
          <el-button type="primary" plain disabled> - 删除处理步骤</el-button>
        </div>
      </div>
    </el-timeline-item>
    <el-timeline-item center placement="top" v-for="(step,index) of steps" :key="step.id">
      <div class="flex flex-row justify-between items-center gap-5">
        <el-select
            v-model="step.value"
            placeholder="Select"
            style="width: 240px"
        >
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <div>
          <el-button type="primary" plain @click="addStep(index+1)"> + 添加处理步骤</el-button>
          <el-button type="primary" plain @click="removeStep(index)"> - 删除处理步骤</el-button>
        </div>
      </div>
    </el-timeline-item>
    <el-timeline-item center placement="top">
      数据存储
    </el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
import {v1 as uuid} from "uuid";
import {ProcessStep} from "@/types";
import {Step} from "@/types/Process.ts";
import {STEP_LABEL_MAP} from "@/const";

// 通过 STEP_LABEL_MAP 生成 options 数组
const options: { value: Step, label: string }[] = Object.entries(STEP_LABEL_MAP).map(([value, label]) => ({
  value: value as Step, // 类型断言，将字符串值转换为 Step 枚举类型
  label: label,
}));

const steps = defineModel<ProcessStep[]>();

const addStep = (index: number) => {
  if (!steps.value) {
    return;
  }
  steps.value.splice(index, 0, {id: uuid(), value: options[0].value});
};

const removeStep = (index: number) => {
  if (!steps.value) {
    return;
  }
  steps.value.splice(index, 1);
};
</script>

<style scoped lang="less">

</style>
