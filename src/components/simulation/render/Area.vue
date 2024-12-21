<template>
  <div v-show="available" class="absolute w-full h-full top-0 left-0">
    <LabelPoi :label="data.label" :position="centerCartesian2Position"/>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref, shallowRef, toRefs} from "vue";
import {Area} from "@/types/SimulationEntities.ts";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";
import * as Cesium from "cesium";
import {CallbackProperty} from "cesium";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import LabelPoi from "@/components/simulation/render/poi/LabelPoi.vue";

type Props = {
  data: Area
}
const props = defineProps<Props>();
const {data} = toRefs(props);
const simulationStore = useSimulationStore();
const {currentDate} = storeToRefs(simulationStore);

const available = ref(true);
const baseScene = inject("baseScene") as BaseCesiumScene;
const centerCartesian2Position = shallowRef<Cesium.Cartesian2>(new Cesium.Cartesian2());
const cartesian3Positions = shallowRef<Cesium.Cartesian3[]>([]);

const area = new Cesium.Entity({
  polyline: {
    positions: new CallbackProperty(() => [...cartesian3Positions.value, cartesian3Positions.value[0]], false),
    clampToGround: true,
    width: 3,
    material: Cesium.Color.WHITE,
  },
  polygon: {
    hierarchy: new CallbackProperty(() => ({
      positions: cartesian3Positions.value,
    }), false), // 设置多边形的顶点
    material: Cesium.Color.BLUE.withAlpha(0.5), // 设置多边形的填充颜色，透明度为 0.5
    outline: false, // 是否显示边框
  }
});

const addArea = () => {
  baseScene.viewer.entities.add(area);
};

const removeArea = () => {
  baseScene.viewer.entities.remove(area);
};

const update = () => {
  const radianPositions = data.value.positions;
  cartesian3Positions.value = radianPositions.map(radians => baseScene.cartographicToCartesian3(Cesium.Cartographic.fromRadians(...radians)));
  const centerCartesian3 = baseScene.getCartesian3sCenter(cartesian3Positions.value);
  const centerCartesian2 = baseScene.cartesian3ToScreen(centerCartesian3);
  if (centerCartesian2) {
    centerCartesian2Position.value = centerCartesian2;
  } else {
    centerCartesian2Position.value = new Cesium.Cartesian2(-1000, -1000);
  }
  // 检查是否在有效时间内
  const currentTimeStamp = currentDate.value.getTime();
  available.value = currentTimeStamp >= data.value.availability[0].getTime() && currentTimeStamp <= data.value.availability[1].getTime();
  area.show = available.value;
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
  addArea();
  addPostRenderListeners();
});

onUnmounted(() => {
  removePostRenderListeners();
  removeArea();
});

</script>

<style scoped lang="less">

</style>
