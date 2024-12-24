<template>
  <div class="absolute w-full h-full top-0 left-0"></div>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, toRefs} from "vue";
import {Model, SmokeConfig} from "@/types/Model.ts";
import {BaseScene} from "@/components/render/entity/BaseScene.ts";
import * as THREE from "three";

type Props = {
  value: Model
}

const props = defineProps<Props>();
const {value: model} = toRefs(props);
const baseScene = inject("scene") as BaseScene;
const config = computed(() => model.value.config as SmokeConfig);

const tex = new THREE.TextureLoader().load('textures/smoke.png');
const material = new THREE.MeshBasicMaterial({
  color: 0x808080,
  depthWrite: false,
  map: tex,
  transparent: true
});
const geometry = new THREE.PlaneGeometry(5, 5);

let particles: THREE.Mesh[] = [];
const clock = new THREE.Clock();
let originPosition = [...config.value.position] as [number, number, number];
let originSize = config.value.size;
const updateModelStatus = () => {
  if (!baseScene || !particles) {
    return;
  }
  const dt = clock.getDelta();
  const positionOffset = config.value.position.map((p, index) => p - originPosition[index]) as [number, number, number];
  particles.forEach(particle => {
    const z = particle.rotation.z;
    particle.lookAt(baseScene.camera.position);
    particle.rotation.z = z + dt * 0.1;
    particle.position.set(particle.position.x + positionOffset[0], particle.position.y + positionOffset[1], particle.position.z + positionOffset[2]);
  });
  if (originSize !== config.value.size) {
    updateSmokeSize();
  }
  originPosition = [...config.value.position];
  originSize = config.value.size;
};

const initModel = async () => {
  updateSmokeSize();
  baseScene.addRenderCallback(updateModelStatus);
};

const updateSmokeSize = () => {
  particles.forEach(particle => baseScene.remove(particle));
  particles = [];
  for (let i = 0; i < 40 * Math.pow(config.value.size / 5, 3); i++) {
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(...config.value.position.map(p => (Math.random() - 0.5) * config.value.size + p) as [number, number, number]);
    particle.rotation.z = Math.random() * Math.PI * 2;
    baseScene.add(particle);
    particles.push(particle);
  }
};

const destroyModel = () => {
  baseScene.removeRenderCallback(updateModelStatus);
  particles.forEach(particle => baseScene.remove(particle));
  particles = [];
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
