<template>
  <div class="px-5 flex flex-col">
    <div class="mb-4">
      <span>光源仰角</span>
      <el-slider v-model="sunParams.elevation" :marks="elevationMarks" :min="0" :max="90"/>
    </div>
    <div class="mb-4">
      <span>光源方位角</span>
      <el-slider v-model="sunParams.azimuth" :marks="azimuthMarks" :min="-180" :max="180"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRenderStore} from "@/store";
import {storeToRefs} from "pinia";
import {CSSProperties, ref} from "vue";

interface Mark {
  style: CSSProperties
  label: string
}

type Marks = Record<number, Mark | string>

const elevationMarks = ref<Marks>({
  0: '0°',
  45: '45°',
  90: '90°',
});

const azimuthMarks = ref<Marks>({
  [-180]: '-180°',
  0: '0°',
  180: '180°',
});

const renderStore = useRenderStore();
const {sunParams} = storeToRefs(renderStore);

</script>

<style scoped lang="less">

</style>
