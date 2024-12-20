<template>
  <el-scrollbar>
    <div class="p-10">
      <div class="text-2xl font-bold my-6">文件列表</div>
      <div class="bg-white p-3 rounded shadow">
        <DataManagementForm/>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import DataManagementForm from "@/components/process/management/DataManagementForm.vue";
</script>

<style scoped lang="less">

</style>
