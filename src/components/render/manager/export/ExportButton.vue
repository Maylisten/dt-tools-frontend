<template>
  <el-button class="h-full" type="primary" style="height: 100%" @click="handleExportClick">
    <ExportIcon class="text-xl"/>
  </el-button>
</template>

<script setup lang="ts">

import ExportIcon from "@/components/icons/ExportIcon.vue";
import {useLayoutStore} from "@/store";
import {saveAs} from "file-saver";
import * as THREE from "three";
import {ElMessage} from "element-plus";
import {BaseScene} from "@/components/render/entity/BaseScene.ts";

const layoutStore = useLayoutStore();
const {beginLoading, endLoading} = layoutStore;

const handleExportClick = () => {
  const baseScene = (window as any).baseScene as BaseScene;
  if (!baseScene) {
    ElMessage.warning("场景未初始化，请稍后重试！");
    return;
  }
  beginLoading();
  exportSceneToJson(baseScene.scene);
  endLoading();
};

const exportSceneToJson = (scene: THREE.Scene) => {
  const sceneJSON = scene.toJSON(); // 将场景序列化为 JSON 对象
  const sceneJSONString = JSON.stringify(sceneJSON);
  saveJson(sceneJSONString);
};

function saveJson(jsonStr: string): void {
  const blob = new Blob([jsonStr], {type: "application/json"});
  saveAs(blob, "scene.json");
}

</script>

<style scoped lang="less">

</style>
