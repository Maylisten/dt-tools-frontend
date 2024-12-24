<template>
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
  <el-form-item label="模型半径">
    <div class="flex flex-row items-center justify-between gap-2">
      <el-input-number v-model="config!.size" :precision="2" :step="0.1" :min="1"></el-input-number>
    </div>
  </el-form-item>
</template>

<script setup lang="ts">
import {SmokeConfig} from "@/types/Model.ts";

const config = defineModel<SmokeConfig>();

</script>

<style scoped lang="less">

</style>
