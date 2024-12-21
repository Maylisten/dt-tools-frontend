<template>
  <div class="h-full w-full shadow border-l-2 border-gray-400 flex flex-col bg-white">
    <div class="h-fit w-full">
      <SimulationManagerHeader/>
    </div>
    <div class="flex-1 relative h-full">
      <div class="absolute h-full w-full left-0 top-0 overflow-hidden">
        <SimulationEntityList/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import SimulationManagerHeader from "@/components/simulation/manager/header/SimulationManagerHeader.vue";
import SimulationEntityList from "@/components/simulation/manager/list/SimulationEntityList.vue";
</script>

<style scoped lang="less">

</style>
