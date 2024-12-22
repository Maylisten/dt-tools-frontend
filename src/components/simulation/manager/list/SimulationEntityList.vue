<template>
  <div class="h-full w-full overflow-hidden">
    <el-scrollbar>
      <PointList/>
      <LineList/>
      <AreaList/>
      <PathList/>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">

import PointList from "@/components/simulation/manager/list/point/PointList.vue";
import LineList from "@/components/simulation/manager/list/line/LineList.vue";
import AreaList from "@/components/simulation/manager/list/area/AreaList.vue";
import PathList from "@/components/simulation/manager/list/path/PathList.vue";
</script>

<style scoped lang="less">

</style>
