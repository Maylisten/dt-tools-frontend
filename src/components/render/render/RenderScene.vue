<template>
  <div class="relative h-full w-full">
    <BaseScene>
      <Sun/>
      <Model v-for="model of modelList" :key="model.id" :data="model"/>
    </BaseScene>
  </div>
</template>

<script setup lang="ts">
import BaseScene from "@/components/render/render/BaseScene.vue";
import Model from "@/components/render/render/Model.vue";
import {useRenderStore} from "@/store";
import {storeToRefs} from "pinia";
import Sun from "@/components/render/render/Sun.vue";

const renderStore = useRenderStore();
const {modelList} = storeToRefs(renderStore);

</script>

<style scoped lang="less">

</style>
