<template>
  <div class="absolute h-full w-full left-0 right-0 ">
    <LineEditTip class="absolute left-0 top-0"/>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, shallowRef} from "vue";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";
import * as Cesium from "cesium";
import {CallbackProperty} from "cesium";
import {useSimulationStore} from "@/store";
import LineEditTip from "@/components/simulation/render/edit/line/LineEditTip.vue";
import {ElMessage} from "element-plus";

const simulationStore = useSimulationStore();
const {createLine, exitEditingMode} = simulationStore;
const baseScene = inject("baseScene") as BaseCesiumScene;
const mouseCartesian3Position = shallowRef<Cesium.Cartesian3>(new Cesium.Cartesian3());
const linePositions: Cesium.Cartesian3[] = [];

const mousePoint = new Cesium.Entity({
  // 设置点的位置 (经度、纬度、高度)
  position: new Cesium.CallbackPositionProperty(() => mouseCartesian3Position.value, false),
  point: {
    pixelSize: 8,        // 点的大小
    color: Cesium.Color.WHITE, // 点的颜色
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 将点固定在地面上
  }
});

const exampleLine = new Cesium.Entity({
  polyline: {
    positions: new CallbackProperty(() => [...linePositions, mouseCartesian3Position.value], false),
    clampToGround: true,
    width: 3,
    material: Cesium.Color.BLUE,
  },
});

const addExampleLine = () => {
  baseScene.viewer.entities.add(mousePoint);
  baseScene.viewer.entities.add(exampleLine);
};

const removeExampleLine = () => {
  baseScene.viewer.entities.remove(mousePoint);
  baseScene.viewer.entities.remove(exampleLine);
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
      linePositions.push(mouseCartesian3Position.value);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 监听鼠标右键
  handler.setInputAction(function () {
    if (linePositions.length > 0) {
      linePositions.pop();
    }
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  // 监听shift + 鼠标右键
  handler.setInputAction(function () {
    if (linePositions.length <= 1) {
      ElMessage.warning("线至少包含两个点！");
    } else {
      createLine(linePositions.map(cartesian3 => {
        const cartographic = baseScene.cartesian3ToCartographic(cartesian3);
        return [cartographic.longitude, cartographic.latitude, cartographic.height];
      }));
      exitEditingMode();
    }
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK, Cesium.KeyboardEventModifier.SHIFT);

  // 监听 ctrl + 鼠标右键
  handler.setInputAction(function () {
    exitEditingMode();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK, Cesium.KeyboardEventModifier.CTRL);

};

const removeMouseListeners = () => {
  handler?.destroy();
};

const beginEdit = () => {
  addExampleLine();
  addMouseListeners();
};

const endEdit = () => {
  removeExampleLine();
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
