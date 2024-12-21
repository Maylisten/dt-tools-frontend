<template>
  <div>
    <div
        class="flex flex-row items-center w-full h-[60px] px-2 gap-2 text-base shadow border-b-2 border-gray-300 bg-gray-200">
      <LineIcon class="text-xl"/>
      <span>线</span>
      <AddButton class="ml-auto" @click="enterLineEditingMode"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import AddButton from "@/components/simulation/manager/list/AddButton.vue";
import {useSimulationStore} from "@/store";
import LineIcon from "@/components/icons/LineIcon.vue";

const simulationStore = useSimulationStore();
const {enterLineEditingMode} = simulationStore;

</script>

<style scoped lang="less">

</style>
