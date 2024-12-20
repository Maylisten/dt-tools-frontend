<template>
  <div class="h-fit w-full">
    <el-form-item label="模型位置" style="margin-bottom: 0;" class="p-2">
      <div class="py-1 flex flex-col items-center justify-between gap-2">
        <el-input-number v-model="model.config!.position[0]" :precision="2" :step="0.1" controls-position="right">
          <template #prefix>
            <span>x:</span>
          </template>
        </el-input-number>
        <el-input-number v-model="model.config!.position[1]" :precision="2" :step="0.1" controls-position="right">
          <template #prefix>
            <span>y:</span>
          </template>
        </el-input-number>
        <el-input-number v-model="model.config!.position[2]" :precision="2" :step="0.1" controls-position="right">
          <template #prefix>
            <span>z:</span>
          </template>
        </el-input-number>
      </div>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import {Model} from "@/types/Model.ts";
import {toRefs} from "vue";

const props = defineProps<{ value: Model }>();
const {value: model} = toRefs(props);

</script>

<style scoped lang="less">

</style>
