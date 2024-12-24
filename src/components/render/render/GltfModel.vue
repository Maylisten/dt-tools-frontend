<template>
  <div class="absolute w-full h-full top-0 left-0"></div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, toRefs} from "vue";
import {GltfConfig, Model} from "@/types/Model.ts";
import {GLTF} from "three-stdlib";
import {BaseScene} from "@/components/render/entity/BaseScene.ts";
import {degreesToRadians, getGltfLoader} from "@/utils/render.ts";

type Props = {
  value: Model
}

const props = defineProps<Props>();
const {value: model} = toRefs(props);
const baseScene = inject("scene") as BaseScene;

let data: GLTF | undefined = undefined;

const updateModelStatus = () => {
  if (!baseScene || !data) {
    return;
  }
  const config = model.value.config as GltfConfig;
  const object = data.scene;
  object.name = model.value.id;
  object.position.set(...config.position);
  object.rotation.set(...(config.rotation.map(degree => degreesToRadians(degree)) as [number, number, number]));
  object.scale.set(config.size, config.size, config.size);
};

const initModel = async () => {
  const config = model.value.config as GltfConfig;
  const modelUrl = config.url;
  const loader = getGltfLoader();
  data = await loader.loadAsync(modelUrl);
  const {scene} = data;
  baseScene.add(scene);
  updateModelStatus();
  baseScene.addRenderCallback(updateModelStatus);
};

const destroyModel = () => {
  baseScene.removeRenderCallback(updateModelStatus);
  baseScene.remove(data?.scene);
};

onMounted(() => {
  initModel();
});

onUnmounted(() => {
  destroyModel();
});

</script>

<style scoped lang="less">

</style>
