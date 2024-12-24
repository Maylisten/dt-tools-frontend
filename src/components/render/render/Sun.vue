<template>
  <div class="absolute w-full h-full top-0 left-0"></div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted} from "vue";
import {BaseScene} from "@/components/render/entity/BaseScene.ts";
import * as THREE from "three";
import {Sky} from 'three/addons/objects/Sky.js';
import {useRenderStore} from "@/store";
import {storeToRefs} from "pinia";

const baseScene = inject("scene") as BaseScene;
const renderStore = useRenderStore();
const {sunParams} = storeToRefs(renderStore);

let sun: THREE.Vector3;
let sky: Sky;

const updateModelStatus = () => {
  if (!baseScene || !sun || !sky) {
    return;
  }
  const pmremGenerator = new THREE.PMREMGenerator(baseScene.renderer);
  const sceneEnv = new THREE.Scene();

  let renderTarget: THREE.WebGLRenderTarget | undefined;

  const phi = THREE.MathUtils.degToRad(90 - sunParams.value.elevation);
  const theta = THREE.MathUtils.degToRad(sunParams.value.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms['sunPosition'].value.copy(sun);

  if (renderTarget !== undefined) {
    renderTarget.dispose();
  }

  sceneEnv.add(sky);
  renderTarget = pmremGenerator.fromScene(sceneEnv);
  baseScene.add(sky);
  baseScene.scene.environment = renderTarget.texture;
  baseScene.sun = sun;
};

const initModel = async () => {
  if (!baseScene) {
    throw Error("scene not ready!");
  }
  sun = new THREE.Vector3();

  sky = new Sky();
  sky.scale.setScalar(10000);
  baseScene.add(sky);
  const skyUniforms = sky.material.uniforms;
  skyUniforms['turbidity'].value = 10;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;
  baseScene.addRenderCallback(updateModelStatus);
};

const destroyModel = () => {
  baseScene.removeRenderCallback(updateModelStatus);
  baseScene.remove(sky);
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
