<template>
  <el-button type="primary" size="small" @click="openLogDialog">
    <LogIcon class="text-base"/>
  </el-button>
  <el-dialog v-model="logDialogVisible" title="屏幕渲染时长日志" width="800">
    <el-table :data="logData" max-height="500">
      <el-table-column property="message" label="事件"/>
      <el-table-column property="begin" label="渲染开始时间" width="250">
        <template #default="scope">
          <span style="margin-left: 10px">{{ formatDate(new Date(scope.row.begin), "yyyy-MM-dd HH:mm:ss.SSS") }}</span>
        </template>
      </el-table-column>
      <el-table-column property="end" label="渲染结束时间" width="250">
        <template #default="scope">
          <span style="margin-left: 10px">{{ formatDate(new Date(scope.row.end), "yyyy-MM-dd HH:mm:ss.SSS") }}</span>
        </template>
      </el-table-column>
      <el-table-column property="duration" label="渲染时长" width="150">
        <template #default="scope">
          <span style="margin-left: 10px">{{ (scope.row.end - scope.row.begin) / 1000 }} 秒</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">

import {useProjectStore} from "@/store";
import {storeToRefs} from "pinia";
import LogIcon from "@/components/icons/LogIcon.vue";
import {ref} from "vue";
import {getLogs} from "@/api/simulation.ts";
import {Log} from "@/types/SimulationEntities.ts";
import {formatDate} from "@/utils";

const projectStore = useProjectStore();
const {currentProjectId} = storeToRefs(projectStore);

const logDialogVisible = ref(false);
const logData = ref<Log[]>([]);
const openLogDialog = async () => {
  const logs = await getLogs(currentProjectId.value!);
  logs.sort((log1, log2) => log2.begin - log1.begin);
  logData.value = logs;
  logDialogVisible.value = true;
};

const closeLogDialog = () => {
  logDialogVisible.value = false;
};

</script>

<style scoped lang="less">

</style>
