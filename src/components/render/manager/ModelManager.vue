<template>
  <div class="h-full w-full shadow bg-white flex flex-col">
    <div class="w-full h-fit">
      <ManagerHeader/>
    </div>
    <div class="relative w-full flex-1">
      <div class="absolute h-full w-full left-0 top-0 overflow-hidden">
        <ModelList/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import ManagerHeader from "@/components/render/manager/add/ManagerHeader.vue";
import ModelList from "@/components/render/manager/list/ModelList.vue";
</script>

<style scoped lang="less">

</style>
