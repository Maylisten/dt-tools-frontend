<template>
  <div>
    <div
        class="flex flex-row items-center w-full h-[60px] px-2 gap-2 text-base shadow border-b-2 border-gray-400 bg-gray-300">
      <LineIcon class="text-xl"/>
      <span>线</span>
      <AddButton class="ml-auto" @click="enterLineEditingMode"/>
    </div>
    <div v-if="lines.length!==0" class="flex flex-col p-2 gap-2">
      <LineItem v-for="line of lines" :key="line.id" :data="line"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import AddButton from "@/components/simulation/manager/list/AddButton.vue";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import LineItem from "@/components/simulation/manager/list/line/LineItem.vue";
import LineIcon from "@/components/icons/LineIcon.vue";

const simulationStore = useSimulationStore();
const {lines} = storeToRefs(simulationStore);
const {enterLineEditingMode} = simulationStore;

</script>

<style scoped lang="less">

</style>
