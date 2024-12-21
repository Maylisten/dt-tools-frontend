<template>
  <div>
    <div
        class="flex flex-row items-center w-full h-[60px] px-2 gap-2 text-base shadow border-b-2 border-gray-300 bg-gray-200">
      <PoiIcon class="text-xl"/>
      <span>点</span>
      <AddButton class="ml-auto" @click="enterPointEditingMode"/>
    </div>
    <div v-if="points.length!==0" class="flex flex-col p-2 gap-2">
      <PointItem v-for="point of points" :key="point.id" :data="point"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import AddButton from "@/components/simulation/manager/list/AddButton.vue";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import PointItem from "@/components/simulation/manager/list/point/PointItem.vue";
import PoiIcon from "@/components/icons/PoiIcon.vue";

const simulationStore = useSimulationStore();
const {points} = storeToRefs(simulationStore);
const {enterPointEditingMode} = simulationStore;

</script>

<style scoped lang="less">

</style>
