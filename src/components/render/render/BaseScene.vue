<template>
  <div class="relative h-full w-full">
    <div v-if="scene" class="absolute h-full w-full left-0 top-0 pointer-events-none z-20">
      <slot></slot>
    </div>
    <div ref="container" class="absolute h-full w-full left-0 top-0 z-10"></div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, provide, ref, shallowRef} from "vue";
import {BaseScene} from "@/components/render/entity/BaseScene.ts";

const container = ref<HTMLElement>();

let scene = shallowRef<BaseScene | undefined>();

onMounted(() => {
  scene.value = new BaseScene(container.value!);
  provide("scene", scene.value);
});

onUnmounted(() => {
  if (scene.value) {
    scene.value.destroy();
  }
});

</script>

<style scoped lang="less">

</style>
