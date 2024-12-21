<template>
  <div>
    <div
        class="flex flex-row items-center w-full h-[60px] px-2 gap-2 text-base shadow border-b-2 border-gray-300 bg-gray-200">
      <PathIcon class="text-xl"/>
      <span>面</span>
      <AddButton class="ml-auto" @click="enterAreaEditingMode"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import PathIcon from "@/components/icons/PathIcon.vue";
import AddButton from "@/components/simulation/manager/list/AddButton.vue";
import {useSimulationStore} from "@/store";

const simulationStore = useSimulationStore();
const {enterAreaEditingMode} = simulationStore;

</script>

<style scoped lang="less">

</style>
