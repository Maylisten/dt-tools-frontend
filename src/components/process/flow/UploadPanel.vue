<template>
  <el-upload
      class="w-[500px]"
      drag
      action="#"
      multiple
      :auto-upload="false"
      v-model:file-list="model"
  >
    <el-icon class="el-icon--upload">
      <upload-filled/>
    </el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        拖拽或点击批量选择需要处理的文件
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import {UploadFilled} from '@element-plus/icons-vue';
import {UploadUserFile} from "element-plus";

const model = defineModel<UploadUserFile[]>();

</script>

<style scoped lang="less">

</style>

