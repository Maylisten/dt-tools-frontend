<template>
  <div class="p-10">
    <div class="text-2xl font-bold mb-6">创建数据处理任务</div>
    <div class="bg-white p-3 rounded shadow">
      <FlowForm/>
    </div>
    <div class="text-2xl font-bold my-6">数据处理进度</div>
    <div class="bg-white p-3 rounded shadow">
      <DataFlowProgressList/>
    </div>
  </div>
</template>

<script setup lang="ts">
import FlowForm from "@/components/process/flow/FlowForm.vue";
import DataFlowProgressList from "@/components/process/flow/DataFlowProgressList.vue";
</script>

<style scoped lang="less">

</style>
