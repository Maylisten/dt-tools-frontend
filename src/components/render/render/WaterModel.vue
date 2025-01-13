<template>
  <div class="absolute w-full h-full top-0 left-0"></div>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, toRefs} from "vue";
import {Model, WaterConfig} from "@/types/Model.ts";
import {BaseScene} from "@/components/render/entity/BaseScene.ts";
import {Clock, PlaneGeometry, RepeatWrapping, TextureLoader, Vector3} from "three";
import {Water} from "three-stdlib";

type Props = {
  value: Model
}

const props = defineProps<Props>();
const {value: model} = toRefs(props);
const baseScene = inject("scene") as BaseScene;

let object: Water | undefined = undefined;

const config = computed(() => model.value.config as WaterConfig);

const clock = new Clock();
const updateModelStatus = () => {
  if (!baseScene || !object || !baseScene.sun) {
    return;
  }
  object.name = model.value.id;
  const delta = clock.getDelta();
  object.material.uniforms['time'].value += delta;
  object.position.set(...config.value.position);
  object.geometry = new PlaneGeometry(config.value.size[0], config.value.size[1]);
  object.material.uniforms['sunDirection'].value.copy(baseScene.sun).normalize();
};

const initModel = async () => {
  const waterGeometry = new PlaneGeometry(config.value.size[0], config.value.size[1]);
  object = new Water(
      waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new TextureLoader().load('textures/waternormals.jpg', function (texture) {
          texture.wrapS = texture.wrapT = RepeatWrapping;
        }),
        sunDirection: new Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: baseScene.scene.fog !== undefined
      }
  );

  object.rotation.x = -Math.PI / 2;
  baseScene.add(object);
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
