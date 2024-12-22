<template>
  <el-dialog v-model="dialogVisible" title="填写路径参数" width="300" :close-on-click-modal="false"
             :close-on-press-escape="false" :show-close="false" :append-to-body="true">
    <el-form>
      <el-form-item label="开始时间" required>
        <el-date-picker v-model="startTime" type="datetime" style="width: 100%"/>
      </el-form-item>
      <el-form-item label="节点间隔" required>
        <el-input-number v-model="interval" :min="1000" :step="1000" style="width: 100%">
          <template #suffix>
            毫秒
          </template>
        </el-input-number>
      </el-form-item>
      <el-form-item>
        <div class="w-full flex flex-row items-center justify-end">
          <el-button @click="handleCancel">退出绘制</el-button>
          <el-button type="primary" @click="handleConfirm">开始绘制</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useSimulationStore} from "@/store";

const simulationStore = useSimulationStore();
const {exitEditingMode} = simulationStore;
const startTime = defineModel<Date>("startTime");
const interval = defineModel<number>("interval");

const dialogVisible = ref(true);

const handleConfirm = () => {
  dialogVisible.value = false;
};

const handleCancel = () => {
  exitEditingMode();
};

</script>

<style scoped lang="less">

</style>
