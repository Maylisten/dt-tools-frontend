<template>
  <div class="absolute h-full w-full left-0 right-0 ">
    <PointEditTip class="absolute left-0 top-0"/>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, shallowRef} from "vue";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";
import PointEditTip from "@/components/simulation/render/edit/point/PointEditTip.vue";
import * as Cesium from "cesium";
import {useSimulationStore} from "@/store";

const simulationStore = useSimulationStore();
const {createPoint, exitEditingMode} = simulationStore;
const baseScene = inject("baseScene") as BaseCesiumScene;
const mouseCartesian3Position = shallowRef<Cesium.Cartesian3>(new Cesium.Cartesian3());

const examplePoint = new Cesium.Entity({
  // 设置点的位置 (经度、纬度、高度)
  position: new Cesium.CallbackPositionProperty(() => mouseCartesian3Position.value, false),
  point: {
    pixelSize: 16,        // 点的大小
    color: Cesium.Color.BLUE, // 点的颜色
    outlineColor: Cesium.Color.WHITE, // 边缘颜色
    outlineWidth: 2,      // 边缘宽度
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 将点固定在地面上
  }
});

const addExamplePoint = () => {
  baseScene.viewer.entities.add(examplePoint);
};

const removeExamplePoint = () => {
  baseScene.viewer.entities.remove(examplePoint);
};

let handler: Cesium.ScreenSpaceEventHandler | undefined = undefined;
const addMouseListeners = () => {
  const viewer = baseScene.viewer;
  const scene = viewer.scene;
  handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

  // 实时获取鼠标坐标
  handler.setInputAction(function (movement: Cesium.ScreenSpaceEventHandler.MotionEvent) {
    const cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
    if (cartesian) {
      mouseCartesian3Position.value = cartesian;
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // 监听鼠标左键
  handler.setInputAction(function () {
    if (mouseCartesian3Position.value) {
      const cartographic = baseScene.cartesian3ToCartographic(mouseCartesian3Position.value);
      createPoint([cartographic.longitude, cartographic.latitude, cartographic.height]);
    }
    exitEditingMode();
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 监听鼠标右键
  handler.setInputAction(function () {
    exitEditingMode();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

const removeMouseListeners = () => {
  handler?.destroy();
};

const beginEdit = () => {
  addExamplePoint();
  addMouseListeners();
};

const endEdit = () => {
  removeExamplePoint();
  removeMouseListeners();
};

onMounted(() => {
  beginEdit();
});

onUnmounted(() => {
  endEdit();
});

</script>

<style scoped lang="less">

</style>
