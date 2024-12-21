<template>
  <div class="h-fit w-full">
    <el-form-item label="模型位置" style="margin-bottom: 0;" class="p-2">
      <div class="py-1 flex flex-col items-center justify-between gap-2">
        <el-input-number v-model="(model.config as GlbConfig)!.position[0]" :precision="2" :step="0.1" controls-position="right">
          <template #prefix>
            <span>x:</span>
          </template>
        </el-input-number>
        <el-input-number v-model="(model.config as GlbConfig)!.position[1]" :precision="2" :step="0.1" controls-position="right">
          <template #prefix>
            <span>y:</span>
          </template>
        </el-input-number>
        <el-input-number v-model="(model.config as GlbConfig)!.position[2]" :precision="2" :step="0.1" controls-position="right">
          <template #prefix>
            <span>z:</span>
          </template>
        </el-input-number>
      </div>
    </el-form-item>
    <el-form-item label="模型角度" class="p-2" style="margin-bottom: 0">
      <div class="py-1 flex flex-col items-center justify-between gap-2">
        <el-input-number v-model="(model.config as GlbConfig)!.rotation[0]" :precision="2" :step="1"
                         controls-position="right" :min="-180"
                         :max="180">
          <template #prefix>
            <span>P:</span>
          </template>
          <template #suffix>
            <span>°</span>
          </template>
        </el-input-number>
        <el-input-number v-model="(model.config as GlbConfig)!.rotation[1]" :precision="2" :step="1"
                         controls-position="right" :min="-180"
                         :max="180">
          <template #prefix>
            <span>Y:</span>
          </template>
          <template #suffix>
            <span>°</span>
          </template>
        </el-input-number>
        <el-input-number v-model="(model.config as GlbConfig)!.rotation[2]" :precision="2" :step="1"
                         controls-position="right" :min="-180"
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
    <el-form-item label="模型比例" style="margin-bottom: 0;" class="p-2">
      <el-input-number v-model="(model.config as GlbConfig)!.size" :precision="2" :step="0.1" :min="0.01"
                       controls-position="right">
        <template #prefix>
          <span>x:</span>
        </template>
      </el-input-number>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import {GlbConfig, Model} from "@/types/Model.ts";
import {toRefs} from "vue";

const props = defineProps<{ value: Model }>();
const {value: model} = toRefs(props);

</script>

<style scoped lang="less">

</style>
