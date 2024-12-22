<template>
  <div>
    <div
        class="flex flex-row items-center w-full h-[60px] px-2 gap-2 text-base shadow border-b-2 border-gray-400 bg-gray-300">
      <PathIcon class="text-xl"/>
      <span>路径</span>
      <AddButton class="ml-auto" @click="enterPathEditingMode"/>
    </div>
    <div v-if="paths.length!==0" class="flex flex-col p-2 gap-2">
      <PathItem v-for=" path of paths" :key="path.id" :data="path"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import AddButton from "@/components/simulation/manager/list/AddButton.vue";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import PathItem from "@/components/simulation/manager/list/path/PathItem.vue";
import PathIcon from "@/components/icons/PathIcon.vue";

const simulationStore = useSimulationStore();
const {paths} = storeToRefs(simulationStore);
const {enterPathEditingMode} = simulationStore;

</script>

<style scoped lang="less">

</style>
