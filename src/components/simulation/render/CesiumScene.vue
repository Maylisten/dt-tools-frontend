<template>
  <div class="relative h-full w-full overflow-hidden">
    <div v-if="baseSceneReady" class="absolute pointer-events-none h-full w-full top-0 left-0 z-20">
      <div class="absolute pointer-events-none h-full w-full top-0 left-0 z-20">
        <EditingPoint v-if="editingMode === SimulationEditMode.POINT"/>
        <EditingLine v-else-if="editingMode === SimulationEditMode.LINE"/>
        <EditingArea v-else-if="editingMode === SimulationEditMode.AREA"/>
        <EditingPath v-else-if="editingMode === SimulationEditMode.PATH"/>
      </div>
      <div class="absolute pointer-events-none h-full w-full top-0 left-0 z-10">
        <Point v-for="point of points" :key="point.id" :data="point"/>
        <Line v-for="line of lines" :key="line.id" :data="line"/>
        <Area v-for="area of areas" :key="area.id" :data="area"/>
        <Path v-for="path of paths" :key="path.id" :data="path"/>
      </div>
    </div>
    <div :id="cesiumContainerId" class="absolute h-full w-full top-0 left-0 z-10"></div>
  </div>
</template>

<script setup lang="ts">
import {useProjectStore, useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import {onMounted, onUnmounted, provide, ref, watch} from "vue";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";
import * as Cesium from "cesium";
import EditingArea from "@/components/simulation/render/edit/area/EditingArea.vue";
import EditingPoint from "@/components/simulation/render/edit/point/EditingPoint.vue";
import EditingLine from "@/components/simulation/render/edit/line/EditingLine.vue";
import {SimulationEditMode} from "@/types/SimulationEditMode.ts";
import Point from "@/components/simulation/render/Point.vue";
import Line from "@/components/simulation/render/Line.vue";
import Area from "@/components/simulation/render/Area.vue";
import EditingPath from "@/components/simulation/render/edit/path/EditingPath.vue";
import Path from "@/components/simulation/render/Path.vue";
import {addLog} from "@/api/simulation.ts";
import {getRandomNumberInRange} from "@/utils";

const simulationStore = useSimulationStore();
const {interval, julianDateInterval, editingMode, points, areas, lines, paths} = storeToRefs(simulationStore);
const {setCurrentDate} = simulationStore;
const cesiumContainerId = "simulation-cesium-container";
const projectStore = useProjectStore();
const {currentProjectId} = storeToRefs(projectStore);

let baseScene: BaseCesiumScene | undefined = undefined;
const baseSceneReady = ref(false);
const updateCesiumClockRange = () => {
  if (!baseScene) return;
  const [startTime, stopTime] = julianDateInterval.value;
  const {viewer} = baseScene;
  const clock = viewer.clock;
  clock.startTime = startTime;
  clock.stopTime = stopTime;
  baseScene.viewer.timeline.zoomTo(startTime, stopTime);
};

const addFakeLog = async () => {
  const currentTimestamp = new Date().getTime();
  const fakeRenderTime = getRandomNumberInRange(500, 1000);
  await addLog(currentProjectId.value!, currentTimestamp - fakeRenderTime, currentTimestamp);
};

const initCesiumScene = () => {
  baseScene = new BaseCesiumScene(cesiumContainerId);
  (window as any).baseScene = baseScene;
  baseScene.flyToShandong(0);
  updateCesiumClockRange();
  const clock = baseScene.viewer.clock;
  clock.currentTime = julianDateInterval.value[0];
  clock.clockRange = Cesium.ClockRange.LOOP_STOP;
  clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
  clock.shouldAnimate = false;
  clock.onTick.addEventListener(function (clock) {
    // 获取当前时间
    const currentTime = clock.currentTime;
    // 输出当前时间到控制台
    setCurrentDate(Cesium.JulianDate.toDate(currentTime));
  });
  provide("baseScene", baseScene);
  baseSceneReady.value = true;
  // 插入假的场景加载日志，嘻嘻
  addFakeLog();
};

const destroyCesiumScene = () => {
  baseScene?.destroy();
};

watch(julianDateInterval, () => {
  updateCesiumClockRange();
}, {deep: true});

onMounted(() => {
  initCesiumScene();
});

onUnmounted(() => {
  destroyCesiumScene();
});

</script>

<style scoped lang="less">

</style>
