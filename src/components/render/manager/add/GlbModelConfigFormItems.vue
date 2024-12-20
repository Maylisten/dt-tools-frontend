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
  <el-form-item label="模型文件">
    <ModelUploader v-model="config!.url" :model-type="ModelType.GLB"/>
  </el-form-item>
</template>

<script setup lang="ts">
import {GlbConfig, ModelType} from "@/types/Model.ts";
import ModelUploader from "@/components/render/manager/add/ModelUploader.vue";

const config = defineModel<GlbConfig>();

</script>

<style scoped lang="less">

</style>
