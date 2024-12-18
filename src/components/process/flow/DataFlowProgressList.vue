<template>
  <div class="flex flex-col gap-4">
    <el-empty v-if="processes?.length === 0" description="暂无处理任务"/>
    <DataFlowProgressItem v-for="process of processes" :key="process.id" :process="process"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {Process} from "@/types/Process.ts";
import {get} from "@/utils/axios.ts";
import {useProjectStore} from "@/store";
import {storeToRefs} from "pinia";
import DataFlowProgressItem from "@/components/process/flow/DataFlowProgressItem.vue";

const projectStore = useProjectStore();
const {currentProjectId} = storeToRefs(projectStore);

const processes = ref<Process[]>();

// 1s 刷新一次数据
const freshInterval = 1000;
let freshTaskId: number | undefined = undefined;
const beginFreshData = async () => {
  await freshData();
  freshTaskId = window.setInterval(freshData, freshInterval);
};
const endFreshData = () => {
  clearInterval(freshTaskId);
};

const freshData = async () => {
  processes.value = await get<Process[]>(`/process/list?projectId=${currentProjectId.value}`);
};

onMounted(() => {
  beginFreshData();
});

onUnmounted(() => {
  endFreshData();
});

</script>

<style scoped lang="less">

</style>
