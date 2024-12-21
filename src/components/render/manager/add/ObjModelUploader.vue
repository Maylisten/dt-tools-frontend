<template>
  <div
      class="w-full h-[150px] border-2 border-dashed border-gray-400 rounded text-gray-500"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDragDrop">
    <div v-if="objUrl !== ''" class="flex flex-row justify-center items-center h-full w-full gap-2">
      <el-icon v-if="topEntryIfFile" style="font-size: 30px">
        <Document/>
      </el-icon>
      <el-icon v-else style="font-size: 30px">
        <Folder/>
      </el-icon>
      <span class="text-xl">{{ topEntryName }}</span>
    </div>
    <div v-else class="flex flex-col justify-center items-center h-full w-full">
      <el-icon style="font-size: 70px">
        <UploadFilled/>
      </el-icon>
      <span>将模型文件/文件夹 <strong class="text-primary-500">拖拽</strong> 到此处</span>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ElMessage} from "element-plus";
import {useLayoutStore} from "@/store";
import {computed, ref} from "vue";
import {readFileFromFileEntry, readSubEntryListFromEntryDirectory, replaceFileName} from "@/utils";
import {Document, Folder, UploadFilled} from "@element-plus/icons-vue";
import {v1 as uuid} from "uuid";
import {uploadDirectory, uploadFile} from "@/api/render.ts";

const BASE_PATH = "/models";

const objUrl = defineModel<string>("objUrl");
const mtlUrl = defineModel<string>("mtlUrl");

const topEntryName = ref("");
const topEntryType = ref("file");

const topEntryIfFile = computed(() => topEntryType.value === "file");

const layoutStore = useLayoutStore();
const {beginLoading, endLoading} = layoutStore;

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault();
};
const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDragDrop = (e: DragEvent) => {
  e.preventDefault();
  if (!e.dataTransfer) {
    throw new Error("drag fail");
  }
  const items = e.dataTransfer.items;
  if (e.dataTransfer.items.length != 1) {
    throw new Error("no drag one entry");
  }
  handleModelUpload(items[0].webkitGetAsEntry()!);
};

const uploadModelFile = async (basePath: string, name: string, file: File) => {
  await uploadFile(basePath, name, file);
};

const uploadModelDirectory = async (basePath: string, name: string) => {
  await uploadDirectory(basePath, name);
};

const getModelUrl = async (modelName: string, entry: FileSystemEntry) => {
  const noMainFileTip = `没有找到 .obj 后缀的文件！`;
  if (entry.isFile) {
    if (entry.name.endsWith("/.obj")) {
      return {
        objUrl: `${BASE_PATH}/${replaceFileName(entry.name, modelName)}`,
        mtlUrl: ``,
      };
    } else {
      throw new Error(noMainFileTip);
    }
  } else {
    // 遍历文件夹
    const subEntryList = await readSubEntryListFromEntryDirectory(entry as FileSystemDirectoryEntry);
    const objEntry = subEntryList.find(entry => entry.isFile && entry.name.endsWith(".obj"));
    const mtlEntry = subEntryList.find(entry => entry.isFile && entry.name.endsWith(".mtl"));
    if (!objEntry) {
      throw new Error(noMainFileTip);
    }
    return {
      objUrl: `${BASE_PATH}/${modelName}/${objEntry.name}`,
      mtlUrl: mtlEntry ? `${BASE_PATH}/${modelName}/${mtlEntry.name}` : "",
    };
  }
};

const uploadModel = async (modelName: string, entry: FileSystemEntry) => {
  let isTop = true;
  const travel = async (basePath: string, currentEntry: FileSystemEntry) => {
    if (currentEntry.isFile) {
      const file = await readFileFromFileEntry(currentEntry as FileSystemFileEntry);
      // 上传模型
      await uploadModelFile(basePath, isTop ? replaceFileName(currentEntry.name, modelName) : currentEntry.name, file);
      isTop = false;
    } else if (currentEntry.isDirectory) {
      // 创建文件夹
      const directoryName = isTop ? modelName : currentEntry.name;
      isTop = false;
      await uploadModelDirectory(basePath, directoryName);
      // 遍历文件夹
      const subEntryList = await readSubEntryListFromEntryDirectory(currentEntry as FileSystemDirectoryEntry);
      for (let subEntry of subEntryList) {
        await travel(`${basePath}/${directoryName}`, subEntry);
      }
    }
  };
  await travel(BASE_PATH, entry);
};

const handleModelUpload = async (entry: FileSystemEntry) => {
  beginLoading();
  if (!entry) {
    ElMessage.error("请拖拽文件或文件夹！");
    return;
  }
  try {
    topEntryType.value = entry.isFile ? "file" : "directory";
    topEntryName.value = entry.name;
    const randomModelName = uuid();
    ({objUrl: objUrl.value, mtlUrl: mtlUrl.value} = await getModelUrl(randomModelName, entry));
    await uploadModel(randomModelName, entry);
  } catch (error) {
    ElMessage.error((error as Error).message);
  }
  endLoading();
};

</script>

<style lang="less" scoped>
</style>
@/server/warehouseServer.js
