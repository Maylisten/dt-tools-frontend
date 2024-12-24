<template>
  <div class="h-full w-full shadow bg-white flex flex-col">
    <div class="w-full flex flex-row gap-1 p-1 h-[45px]">
      <div class="flex-1 h-full">
        <AddButton/>
      </div>
      <div class="w-fit h-full">
        <ExportButton/>
      </div>
    </div>
    <div class="relative w-full flex-1">
      <div class="absolute h-full w-full left-0 top-0 overflow-hidden">
        <ModelList/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import AddButton from "@/components/render/manager/add/AddButton.vue";
import ModelList from "@/components/render/manager/list/ModelList.vue";
import ExportButton from "@/components/render/manager/export/ExportButton.vue";
</script>

<style scoped lang="less">

</style>
