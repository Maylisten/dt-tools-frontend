<template>
  <div v-show="available" class="absolute w-full h-full top-0 left-0">
    <LabelPoi :label="data.label" :position="centerCartesian2Position"/>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref, shallowRef, toRefs} from "vue";
import {Line} from "@/types/SimulationEntities.ts";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";
import * as Cesium from "cesium";
import {CallbackProperty} from "cesium";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import LabelPoi from "@/components/simulation/render/poi/LabelPoi.vue";

type Props = {
  data: Line
}
const props = defineProps<Props>();
const {data} = toRefs(props);
const simulationStore = useSimulationStore();
const {currentDate} = storeToRefs(simulationStore);

const available = ref(true);
const baseScene = inject("baseScene") as BaseCesiumScene;
const centerCartesian2Position = shallowRef<Cesium.Cartesian2>(new Cesium.Cartesian2());
const cartesian3Positions = shallowRef<Cesium.Cartesian3[]>([]);

const line = new Cesium.Entity({
  polyline: {
    positions: new CallbackProperty(() => cartesian3Positions.value, false),
    clampToGround: true,
    width: 3,
    material: Cesium.Color.BLUE,
  },
});

const addLine = () => {
  baseScene.viewer.entities.add(line);
};

const removeLine = () => {
  baseScene.viewer.entities.remove(line);
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
  line.show = available.value;
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
  addLine();
  addPostRenderListeners();
});

onUnmounted(() => {
  removePostRenderListeners();
  removeLine();
});

</script>

<style scoped lang="less">

</style>
