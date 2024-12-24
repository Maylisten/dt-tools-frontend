<template>
  <div class="absolute w-full h-full top-0 left-0"></div>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, toRefs} from "vue";
import {FlameConfig, Model} from "@/types/Model.ts";
import {BaseScene} from "@/components/render/entity/BaseScene.ts";
import * as THREE from "three";
import {Fire} from "@/libs/fire/Fire.ts";

type Props = {
  value: Model
}

const props = defineProps<Props>();
const {value: model} = toRefs(props);
const baseScene = inject("scene") as BaseScene;
const config = computed(() => model.value.config as FlameConfig);

let fire: Fire;

const updateModelStatus = () => {
  if (!baseScene || !fire) {
    return;
  }
  fire.position.set(...config.value.position);
  fire.update(performance.now() / 1000);
};

const initModel = async () => {
  const textureLoader = new THREE.TextureLoader();
  const tex = textureLoader.load("textures/fire.png");
  fire = new Fire(tex, new THREE.Color().setRGB(0, 0, 0));
  baseScene.add(fire);
  baseScene.addRenderCallback(updateModelStatus);
};

const destroyModel = () => {
  baseScene.removeRenderCallback(updateModelStatus);
  baseScene.remove(fire);
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
