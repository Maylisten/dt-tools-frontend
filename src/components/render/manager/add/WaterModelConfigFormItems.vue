<template>
  <el-form-item label="模型大小">
    <div class="py-1 flex flex-row items-center justify-between gap-2">
      <el-input-number v-model="config!.size[0]" controls-position="right">
        <template #prefix>
          <span>长:</span>
        </template>
      </el-input-number>
      <el-input-number v-model="config!.size[1]" controls-position="right">
        <template #prefix>
          <span>宽:</span>
        </template>
      </el-input-number>
    </div>
  </el-form-item>
  <el-form-item label="模型位置">
    <div class="py-1 flex flex-row items-center justify-between gap-2">
      <el-input-number v-model="config!.position[0]" :precision="2" :step="0.1" controls-position="right">
        <template #prefix>
          <span>x:</span>
        </template>
      </el-input-number>
      <el-input-number v-model="config!.position[1]" :precision="2" :step="0.1" controls-position="right">
        <template #prefix>
          <span>y:</span>
        </template>
      </el-input-number>
      <el-input-number v-model="config!.position[2]" :precision="2" :step="0.1" controls-position="right">
        <template #prefix>
          <span>z:</span>
        </template>
      </el-input-number>
    </div>
  </el-form-item>
</template>

<script setup lang="ts">
import {WaterConfig} from "@/types/Model.ts";

const config = defineModel<WaterConfig>();

</script>

<style scoped lang="less">

</style>
