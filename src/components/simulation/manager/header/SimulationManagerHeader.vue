<template>
  <div class="border-b-2 border-gray-400 shadow-sm">
    <div class="w-full h-[40px] flex flex-row justify-between px-2">
      <div class="h-full flex justify-center items-center font-bold">实体列表</div>
      <div class="flex flex-row gap-1 items-center">
        <el-button-group>
          <ExportButton/>
        </el-button-group>
      </div>
    </div>
    <div>
      <DatePicker/>
    </div>
  </div>

</template>

<script setup lang="ts">

import ExportButton from "@/components/simulation/manager/header/ExportButton.vue";
import DatePicker from "@/components/simulation/manager/header/DatePicker.vue";
</script>

<style scoped lang="less">

</style>
