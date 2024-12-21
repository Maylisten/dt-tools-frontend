<template>
  <div class="absolute w-full h-full top-0 left-0"></div>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, toRefs} from "vue";
import {FlameConfig, Model} from "@/types/Model.ts";
import {BaseScene} from "@/components/render/entity/BaseScene.ts";
import * as THREE from "three";
import * as TWEEN from '@tweenjs/tween.js';

type Props = {
  value: Model
}

const props = defineProps<Props>();
const {value: model} = toRefs(props);
const baseScene = inject("scene") as BaseScene;
const config = computed(() => model.value.config as FlameConfig);

const updateModelStatus = () => {
  if (!baseScene) {
    return;
  }
};

const initModel = async () => {
  const container = new THREE.Object3D();
  const texture = new THREE.TextureLoader().load("textures/flamex.png");
  //sprite材质
  const material = new THREE.SpriteMaterial({
    //以canvas作为纹理
    map: texture,
    //混合度 加法混合
    blending: THREE.AdditiveBlending
  });

  //循环1000  添加粒子
  for (let i = 0; i < 2000; i++) {
    const particle = new THREE.Sprite(material);
    initParticle(particle, i);
    container.add(particle);
    container.name = "particles_flame";
  }
  baseScene.add(container);
};

function initParticle(particle: THREE.Sprite, delay: number) {
  particle.position.set(5, Math.random() + 5, 0);
  particle.scale.x = particle.scale.y = Math.random() * 3;
  //下面是一系列的动画
  let xx = Math.random() * 10 - 5;
  let yy = Math.cos((Math.PI / 100) * xx) * 20;
  //位移
  new TWEEN.Tween(particle.position)
      .delay(delay)
      .to({
        x: xx,
        y: yy,
        z: Math.random() * 10 - 5
      }, 2000)
      .onComplete(function () {
        initParticle(particle, delay);
      })
      .start();
  // 大小
  new TWEEN.Tween(particle.scale)
      .delay(delay)
      .to({
        x: 0.01,
        y: 0.01
      }, 1000)
      .start();
}

const destroyModel = () => {

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
