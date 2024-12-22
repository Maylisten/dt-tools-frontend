<template>
  <div v-show="available" class="absolute w-full h-full top-0 left-0">
    <PathPoint v-for="point of pathCartesian3Points" :key="point.time.getTime()" :position="point.position"
               :time="point.time"/>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, ref, shallowRef, toRefs} from "vue";
import {Path} from "@/types/SimulationEntities.ts";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";
import * as Cesium from "cesium";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import PathPoint from "@/components/simulation/render/edit/path/PathPoint.vue";

type Props = {
  data: Path
}
const props = defineProps<Props>();
const {data} = toRefs(props);
const simulationStore = useSimulationStore();
const {currentDate} = storeToRefs(simulationStore);

const available = ref(true);
const baseScene = inject("baseScene") as BaseCesiumScene;
const centerCartesian2Position = shallowRef<Cesium.Cartesian2>(new Cesium.Cartesian2());
const cartesian3Positions = shallowRef<Cesium.Cartesian3[]>([]);
const pathCartesian3Points = computed(() => data.value.points.map(point => ({
  time: point.time,
  position: baseScene.cartographicToCartesian3(Cesium.Cartographic.fromRadians(...point.position))
})));

const sampledPositions = new Cesium.SampledPositionProperty();
pathCartesian3Points.value.forEach(point => {
  sampledPositions.addSample(Cesium.JulianDate.fromDate(point.time), point.position);
});

const path = new Cesium.Entity({
  id: data.value.id,
  position: sampledPositions,
  point: {
    pixelSize: 16,        // 点的大小
    color: Cesium.Color.BLUE, // 点的颜色
    outlineColor: Cesium.Color.WHITE, // 边缘颜色
    outlineWidth: 2,      // 边缘宽度
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 将点固定在地面上
  },
  path: {
    material: Cesium.Color.WHITE,
    width: 2,
    leadTime: 10000,
    trailTime: 10000,
  },
  orientation: new Cesium.VelocityOrientationProperty(sampledPositions),
});

const addPath = () => {
  baseScene.viewer.entities.add(path);
};

const removePath = () => {
  baseScene.viewer.entities.remove(path);
};

const update = () => {
  const radianPositions = data.value.points.map(point => point.position);
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
  path.show = available.value;
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
  addPath();
  addPostRenderListeners();
});

onUnmounted(() => {
  removePostRenderListeners();
  removePath();
});

</script>

<style scoped lang="less">

</style>
