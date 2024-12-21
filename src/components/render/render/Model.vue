<template>
  <GltfModel v-if="model.type === ModelType.GLTF" :value="model"/>
  <GlbModel v-if="model.type === ModelType.GLB" :value="model"/>
  <ObjModel v-else-if="model.type === ModelType.OBJ" :value="model"/>
  <WaterModel v-else-if="model.type === ModelType.WATER" :value="model"/>
  <FlameModel v-else-if="model.type === ModelType.FLAME" :value="model"/>
  <div v-else></div>
</template>

<script setup lang="ts">
import {Model, ModelType} from "@/types/Model.ts";
import {toRefs} from "vue";
import GltfModel from "@/components/render/render/GltfModel.vue";
import GlbModel from "@/components/render/render/GlbModel.vue";
import ObjModel from "@/components/render/render/ObjModel.vue";
import WaterModel from "@/components/render/render/WaterModel.vue";
import FlameModel from "@/components/render/render/FlameModel.vue";

type Props = {
  data: Model
}
const props = defineProps<Props>();
const {data: model} = toRefs(props);

</script>

<style scoped lang="less">

</style>
