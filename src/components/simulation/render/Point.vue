<template>
  <div v-show="available" class="absolute w-full h-full top-0 left-0">
    <LabelPoi :label="data.label" :position="cartesian2Position"/>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref, shallowRef, toRefs} from "vue";
import {Point} from "@/types/SimulationEntities.ts";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";
import * as Cesium from "cesium";
import LabelPoi from "@/components/simulation/render/poi/LabelPoi.vue";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";

type Props = {
  data: Point
}
const props = defineProps<Props>();
const {data} = toRefs(props);
const simulationStore = useSimulationStore();
const {currentDate} = storeToRefs(simulationStore);

const available = ref(true);
const baseScene = inject("baseScene") as BaseCesiumScene;
const cartesian2Position = shallowRef<Cesium.Cartesian2>(new Cesium.Cartesian2());
const cartesian3Position = shallowRef<Cesium.Cartesian3>(new Cesium.Cartesian3());

const point = new Cesium.Entity({
  // 设置点的位置 (经度、纬度、高度)
  position: new Cesium.CallbackPositionProperty(() => cartesian3Position.value, false),
  point: {
    pixelSize: 16,        // 点的大小
    color: Cesium.Color.BLUE, // 点的颜色
    outlineColor: Cesium.Color.WHITE, // 边缘颜色
    outlineWidth: 2,      // 边缘宽度
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 将点固定在地面上
  }
});

const addPoint = () => {
  baseScene.viewer.entities.add(point);
};

const removePoint = () => {
  baseScene.viewer.entities.remove(point);
};

const update = () => {
  const [longitude, latitude, altitude] = data.value.position;
  const cartesian3 = baseScene.cartographicToCartesian3(Cesium.Cartographic.fromRadians(longitude, latitude, altitude));
  const cartesian2 = baseScene.cartesian3ToScreen(cartesian3);
  cartesian3Position.value = cartesian3;
  if (cartesian2) {
    cartesian2Position.value = cartesian2;
  } else {
    cartesian2Position.value = new Cesium.Cartesian2(-1000, -1000);
  }

  // 检查是否在有效时间内
  const currentTimeStamp = currentDate.value.getTime();
  available.value = currentTimeStamp >= data.value.availability[0].getTime() && currentTimeStamp <= data.value.availability[1].getTime();
  point.show = available.value;
};

const addPostRenderListeners = () => {
  const viewer = baseScene.viewer;
  viewer.scene.postRender.addEventListener(update);
};

const removePostRenderListeners = () => {
  const viewer = baseScene.viewer;
  viewer.scene.postRender.removeEventListener(update);
};

onMounted(() => {
  addPoint();
  addPostRenderListeners();
});

onUnmounted(() => {
  removePostRenderListeners();
  removePoint();
});

</script>

<style scoped lang="less">

</style>
