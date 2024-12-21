<template>
  <div>
    <div
        class="flex flex-row items-center w-full h-[60px] px-2 gap-2 text-base shadow border-b-2 border-gray-300 bg-gray-200">
      <AreaIcon class="text-xl"/>
      <span>面</span>
      <AddButton class="ml-auto" @click="enterAreaEditingMode"/>
    </div>
    <div v-if="areas.length!==0" class="flex flex-col p-2 gap-2">
      <AreaItem v-for="area of areas" :key="area.id" :data="area"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import AddButton from "@/components/simulation/manager/list/AddButton.vue";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import AreaItem from "@/components/simulation/manager/list/area/AreaItem.vue";
import AreaIcon from "@/components/icons/AreaIcon.vue";

const simulationStore = useSimulationStore();
const {areas} = storeToRefs(simulationStore);
const {enterAreaEditingMode} = simulationStore;

</script>

<style scoped lang="less">

</style>
