<template>
  <div class="absolute h-full w-full left-0 right-0 ">
    <AreaEditTip class="absolute left-0 top-0"/>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, shallowRef} from "vue";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";
import * as Cesium from "cesium";
import {CallbackProperty} from "cesium";
import {useSimulationStore} from "@/store";
import {ElMessage} from "element-plus";
import AreaEditTip from "@/components/simulation/render/edit/area/AreaEditTip.vue";

const simulationStore = useSimulationStore();
const {createArea, exitEditingMode} = simulationStore;
const baseScene = inject("baseScene") as BaseCesiumScene;
const mouseCartesian3Position = shallowRef<Cesium.Cartesian3>(new Cesium.Cartesian3());
const areaPositions: Cesium.Cartesian3[] = [];

const mousePoint = new Cesium.Entity({
  // 设置点的位置 (经度、纬度、高度)
  position: new Cesium.CallbackPositionProperty(() => mouseCartesian3Position.value, false),
  point: {
    pixelSize: 8,        // 点的大小
    color: Cesium.Color.WHITE, // 点的颜色
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 将点固定在地面上
  }
});

const exampleArea = new Cesium.Entity({
  polyline: {
    show: true,
    positions: new CallbackProperty(() => {
      const positions = [...areaPositions, mouseCartesian3Position.value];
      if (areaPositions.length > 0) {
        positions.push(areaPositions[0]);
      }
      return positions;
    }, false),
    clampToGround: true,
    width: 3,
    material: Cesium.Color.WHITE,
  },
  polygon: {
    show: false,
    hierarchy: new CallbackProperty(() => ({
      positions: [...areaPositions, mouseCartesian3Position.value]
    }), false), // 设置多边形的顶点
    material: Cesium.Color.BLUE.withAlpha(0.5), // 设置多边形的填充颜色，透明度为 0.5
    outline: false, // 是否显示边框
  }
});

const addExampleArea = () => {
  baseScene.viewer.entities.add(mousePoint);
  baseScene.viewer.entities.add(exampleArea);
};

const removeExampleArea = () => {
  baseScene.viewer.entities.remove(mousePoint);
  baseScene.viewer.entities.remove(exampleArea);
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
      areaPositions.push(mouseCartesian3Position.value);
      if (areaPositions.length >= 2) {
        exampleArea.polygon!.show = new Cesium.ConstantProperty(true);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 监听鼠标右键
  handler.setInputAction(function () {
    if (areaPositions.length > 0) {
      areaPositions.pop();
      if (areaPositions.length <= 1) {
        exampleArea.polygon!.show = new Cesium.ConstantProperty(false);
      }
    }
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  // 监听shift + 鼠标右键
  handler.setInputAction(function () {
    if (areaPositions.length <= 2) {
      ElMessage.warning("面至少包含三个点！");
    } else {
      createArea(areaPositions.map(cartesian3 => {
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
  addExampleArea();
  addMouseListeners();
};

const endEdit = () => {
  removeExampleArea();
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
