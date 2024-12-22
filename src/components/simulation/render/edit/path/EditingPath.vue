<template>
  <div class="absolute h-full w-full left-0 right-0 ">
    <PathEditTip class="absolute left-0 top-0"/>
    <PathParamsDialog v-model:start-time="startDatetime" v-model:interval="interval"/>
    <LabelPoi :label="formatDate(mouseDatetime)" :position="mouseCartesian2Position"/>
    <PathPoint v-for="point of pathCartesian3Points" :key="point.time.getTime()" :position="point.position"
               :time="point.time"/>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, ref, shallowRef} from "vue";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";
import * as Cesium from "cesium";
import {CallbackProperty} from "cesium";
import {useSimulationStore} from "@/store";
import {ElMessage} from "element-plus";
import PathEditTip from "@/components/simulation/render/edit/path/PathEditTip.vue";
import PathParamsDialog from "@/components/simulation/render/edit/path/PathParamsDialog.vue";
import {storeToRefs} from "pinia";
import LabelPoi from "@/components/simulation/render/poi/LabelPoi.vue";
import {formatDate} from "@/utils";
import PathPoint from "@/components/simulation/render/edit/path/PathPoint.vue";

const simulationStore = useSimulationStore();
const {createPath, exitEditingMode} = simulationStore;
const {interval: sceneInterval} = storeToRefs(simulationStore);
const startDatetime = ref(sceneInterval.value[0]);
const interval = ref(2000);
const baseScene = inject("baseScene") as BaseCesiumScene;
const mouseCartesian3Position = shallowRef<Cesium.Cartesian3>(new Cesium.Cartesian3());
const mouseCartesian2Position = shallowRef<Cesium.Cartesian2>(new Cesium.Cartesian2());

const pathCartesian3Points = ref<{ position: Cesium.Cartesian3, time: Date }[]>([]);
const mouseDatetime = computed(() => new Date(startDatetime.value.getTime() + interval.value * pathCartesian3Points.value.length));

const mousePoint = new Cesium.Entity({
  // 设置点的位置 (经度、纬度、高度)
  position: new Cesium.CallbackPositionProperty(() => mouseCartesian3Position.value, false),
  point: {
    pixelSize: 8,        // 点的大小
    color: Cesium.Color.WHITE, // 点的颜色
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 将点固定在地面上
  }
});

const examplePath = new Cesium.Entity({
  polyline: {
    positions: new CallbackProperty(() => [...pathCartesian3Points.value.map(point => point.position), mouseCartesian3Position.value], false),
    clampToGround: true,
    width: 3,
    material: Cesium.Color.WHITE,
  },
});

const addExamplePath = () => {
  baseScene.viewer.entities.add(mousePoint);
  baseScene.viewer.entities.add(examplePath);
};

const removeExamplePath = () => {
  baseScene.viewer.entities.remove(mousePoint);
  baseScene.viewer.entities.remove(examplePath);
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
      const cartesian2 = baseScene.cartesian3ToScreen(cartesian);
      if (cartesian2) {
        mouseCartesian2Position.value = cartesian2;
      } else {
        mouseCartesian2Position.value = new Cesium.Cartesian2(-1000, -1000);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // 监听鼠标左键
  handler.setInputAction(function () {
    if (mouseCartesian3Position.value) {
      const position = mouseCartesian3Position.value;
      const time = new Date(mouseDatetime.value.getTime());
      pathCartesian3Points.value.push({position, time});
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 监听鼠标右键
  handler.setInputAction(function () {
    if (pathCartesian3Points.value.length > 0) {
      pathCartesian3Points.value.pop();
    }
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  // 监听shift + 鼠标右键
  handler.setInputAction(function () {
    if (pathCartesian3Points.value.length <= 1) {
      ElMessage.warning("路径至少包含两个点！");
    } else {
      createPath(pathCartesian3Points.value.map(cartesian3Point => {
        const cartographic = baseScene.cartesian3ToCartographic(cartesian3Point.position);
        return {
          time: cartesian3Point.time,
          position: [cartographic.longitude, cartographic.latitude, cartographic.height]
        };
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
  addExamplePath();
  addMouseListeners();
};

const endEdit = () => {
  removeExamplePath();
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
