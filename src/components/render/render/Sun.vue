<template>
  <div class="absolute w-full h-full top-0 left-0"></div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, watch} from "vue";
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
let pmremGenerator: THREE.PMREMGenerator;
let sceneEnv: THREE.Scene;
let renderTarget: THREE.WebGLRenderTarget | undefined;

const updateModelStatus = () => {
  if (!baseScene || !sun || !sky || !pmremGenerator || !sceneEnv) {
    return;
  }

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

  pmremGenerator = new THREE.PMREMGenerator(baseScene.renderer);
  sceneEnv = new THREE.Scene();
  updateModelStatus();
};

const destroyModel = () => {
  pmremGenerator.dispose();
  sceneEnv.clear();
  baseScene.remove(sky);
};

watch(sunParams, () => {
  updateModelStatus();
}, {deep: true});

onMounted(() => {
  initModel();
});

onUnmounted(() => {
  destroyModel();
});

</script>

<style scoped lang="less">

</style>
