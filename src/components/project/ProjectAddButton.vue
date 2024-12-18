<template>
  <div>
    <el-dialog v-model="dialogVisible" title="创建场景" width="500">
      <el-form :model="formData" label-width="auto" style="max-width: 600px" @submit.prevent
               @keyup.enter="onSubmit">
        <el-form-item label="场景名称">
          <el-input v-model="formData.name"/>
        </el-form-item>
        <el-form-item>
          <div class="w-full flex flex-row justify-end">
            <el-button type="primary" @click="onSubmit">创建</el-button>
            <el-button @click="closeDialog">Cancel</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <button
        class="w-80 h-56 bg-white border-gray-300 border-2 border-dashed rounded hover:cursor-pointer opacity-80 hover:scale-105 hover:opacity-100 transition-transform flex flex-row justify-center items-center"
        @click="openDialog"
    >
      <AddIcon class="text-5xl text-gray-400"/>
    </button>
  </div>
</template>

<script setup lang="ts">

import AddIcon from "@/components/icons/AddIcon.vue";
import {ref} from "vue";
import {ElMessage} from 'element-plus';
import {useProjectStore} from "@/store";

const projectStore = useProjectStore();
const {addProject} = projectStore;

const dialogVisible = ref(false);
const formData = ref({
  name: ""
});

const openDialog = () => {
  dialogVisible.value = true;
};
const closeDialog = () => {
  dialogVisible.value = false;
  formData.value.name = "";
};

const onSubmit = async () => {
  const name = formData.value.name;
  if (name === "") {
    ElMessage.error('场景名称不能为空');
    return;
  }
  await addProject(formData.value.name);
  closeDialog();
  ElMessage.success('场景添加成功！');
};

</script>

<style scoped lang="less">

</style>
