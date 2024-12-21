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
  <el-form-item label="模型角度">
    <div class="py-1 flex flex-row items-center justify-between gap-2">
      <el-input-number v-model="config!.rotation[0]" :precision="2" :step="1" controls-position="right" :min="-180"
                       :max="180">
        <template #prefix>
          <span>P:</span>
        </template>
        <template #suffix>
          <span>°</span>
        </template>
      </el-input-number>
      <el-input-number v-model="config!.rotation[1]" :precision="2" :step="1" controls-position="right" :min="-180"
                       :max="180">
        <template #prefix>
          <span>Y:</span>
        </template>
        <template #suffix>
          <span>°</span>
        </template>
      </el-input-number>
      <el-input-number v-model="config!.rotation[2]" :precision="2" :step="1" controls-position="right" :min="-180"
                       :max="180">
        <template #prefix>
          <span>R:</span>
        </template>
        <template #suffix>
          <span>°</span>
        </template>
      </el-input-number>
    </div>
  </el-form-item>
  <el-form-item label="模型文件">
    <GlModelUploader v-model="config!.url" :model-type="ModelType.GLTF"/>
  </el-form-item>
  <el-form-item label="模型比例">
    <div class="p-2 flex flex-row items-center justify-between gap-2">
      <el-input-number v-model="config!.size" :precision="2" :step="0.1" :min="0.01"></el-input-number>
    </div>
  </el-form-item>
</template>

<script setup lang="ts">
import {GltfConfig, ModelType} from "@/types/Model.ts";
import GlModelUploader from "@/components/render/manager/add/GlModelUploader.vue";

const config = defineModel<GltfConfig>();

</script>

<style scoped lang="less">

</style>
