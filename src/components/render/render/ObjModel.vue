<template>
  <div class="absolute w-full h-full top-0 left-0"></div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, toRefs} from "vue";
import {Model, ObjConfig} from "@/types/Model.ts";
import {BaseScene} from "@/components/render/entity/BaseScene.ts";
import {degreesToRadians, getMtlLoader, getOBJLoader} from "@/utils/render.ts";
import {Group} from "three";

type Props = {
  value: Model
}

const props = defineProps<Props>();
const {value: model} = toRefs(props);
const baseScene = inject("scene") as BaseScene;

let object: Group | undefined = undefined;

const updateModelStatus = () => {
  if (!baseScene || !object) {
    return;
  }
  const config = model.value.config as ObjConfig;
  object.position.set(...config.position);
  object.rotation.set(...(config.rotation.map(degree => degreesToRadians(degree)) as [number, number, number]));
  object.scale.set(config.size, config.size, config.size);
};

const initModel = async () => {
  const config = model.value.config as ObjConfig;
  const objUrl = config.objUrl;
  const mtlUrl = config.mtlUrl;
  const objLoader = getOBJLoader();
  const mtlLoader = getMtlLoader();
  if (mtlUrl) {
    const materials = await mtlLoader.loadAsync(mtlUrl);
    materials.preload();
    objLoader.setMaterials(materials);
  }
  object = await objLoader.loadAsync(objUrl);
  object.traverse(function (child) {
    if (child.geometry && !child.geometry.hasAttribute('normal')) {
      child.geometry.computeVertexNormals();
    }
  });
  baseScene.add(object);
  updateModelStatus();
  baseScene.addRenderCallback(updateModelStatus);
};

const destroyModel = () => {
  baseScene.removeRenderCallback(updateModelStatus);
  baseScene.remove(object);
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
