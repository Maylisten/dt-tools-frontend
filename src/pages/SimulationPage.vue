<template>
  <div class="w-full h-full overflow-hidden flex flex-row">
    <div class="relative flex-1 h-full">
      <div class="absolute h-full w-full top-0 left-0">
        <CesiumScene/>
      </div>
    </div>
    <div class="w-[400px] h-full">
      <EntityManager/>
    </div>
  </div>
</template>

<script setup lang="ts">

import CesiumScene from "@/components/simulation/render/CesiumScene.vue";
import EntityManager from "@/components/simulation/manager/EntityManager.vue";
</script>

<style scoped lang="less">

</style>
