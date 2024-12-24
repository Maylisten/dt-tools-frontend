<template>
  <div class="absolute w-full h-full top-0 left-0"></div>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, toRefs} from "vue";
import {FlameConfig, Model} from "@/types/Model.ts";
import {BaseScene} from "@/components/render/entity/BaseScene.ts";
import Particle, {ParticleOptions} from "@/libs/ParticleFire/Particle.ts";
import {Clock, Points} from "three";

type Props = {
  value: Model
}

const props = defineProps<Props>();
const {value: model} = toRefs(props);
const baseScene = inject("scene") as BaseScene;
const config = computed(() => model.value.config as FlameConfig);

let particleFire: Particle | undefined = undefined;

const clock = new Clock();
const options = Object.fromEntries(Object.entries(ParticleOptions).map(([key, value]) => [key, value.default]));

const updateModelStatus = () => {
  if (!baseScene || !particleFire) {
    return;
  }
  const elapsed = clock.getElapsedTime();
  particleFire.bulkSetAttrs(options);
  particleFire.update(elapsed);
  const particleSystem = particleFire.particleSystem as Points;
  particleSystem.position.set(...config.value.position);
};

const initModel = async () => {
  particleFire = new Particle(options);
  const particleSystem = particleFire.particleSystem as Points;
  particleSystem.name = model.value.id;
  baseScene.add(particleSystem);
  baseScene.addRenderCallback(updateModelStatus);
};

const destroyModel = () => {
  if (!particleFire) {
    return;
  }
  baseScene.removeRenderCallback(updateModelStatus);
  baseScene.remove(particleFire.particleSystem);
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
