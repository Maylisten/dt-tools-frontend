<template>
  <el-form label-width="150">
    <el-form-item label="文件/文件夹选择">
      <UploadPanel v-model="files"/>
    </el-form-item>
    <el-form-item label="数据处理流程">
      <ProcessFlow v-model="steps"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">执行</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">

import UploadPanel from "@/components/process/flow/UploadPanel.vue";
import {ElMessage, UploadUserFile} from "element-plus";
import {ref} from "vue";
import {ProcessStep} from "@/types";
import ProcessFlow from "@/components/process/flow/ProcessFlow.vue";
import {post} from "@/utils/axios.ts";
import {useProjectStore} from "@/store";
import {storeToRefs} from "pinia";

const projectStore = useProjectStore();
const {currentProjectId} = storeToRefs(projectStore);

const files = ref<UploadUserFile[]>([]);
const steps = ref<ProcessStep[]>([]);

const resetForm = () => {
  files.value = [];
  steps.value = [];
};

const submit = async () => {
  try {
    const uploadUrl = "/process/upload";
    if (files.value.length === 0) {
      ElMessage.error('文件列表不得为空');
      return;
    }
    const formData = new FormData();
    formData.append("projectId", currentProjectId.value as string);
    files.value.forEach(file => {
      formData.append('files', file.raw!);
    });
    steps.value.forEach(step => {
      formData.append('steps', step.value);
    });
    await post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    ElMessage.success('数据开始处理！');
  } catch (error) {
    ElMessage.success('网络异常，请稍后重试！');
  } finally {
    resetForm();
  }
};

</script>

<style scoped lang="less">

</style>
