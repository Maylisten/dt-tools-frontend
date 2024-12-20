<template>
  <div class="w-full h-full overflow-hidden flex flex-row">
    <div class="flex-1 h-full relative">
      <div class="absolute left-0 top-0 h-full w-full">
        <RenderScene/>
      </div>
    </div>
    <div class="h-full w-[300px] ">
      <ModelManager/>
    </div>
  </div>
</template>

<script setup lang="ts">

import RenderScene from "@/components/render/render/RenderScene.vue";
import ModelManager from "@/components/render/manager/ModelManager.vue";
</script>

<style scoped lang="less">

</style>
