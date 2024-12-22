<template>
  <div class="absolute w-full h-full top-0 left-0">
    <LabelPoi :position="cartesian2Position" width="200px">
      <template #default>
        <FlagIcon class="mr-2"/>
        {{ formatDate(time) }}
      </template>
    </LabelPoi>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, shallowRef, toRefs} from "vue";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";
import * as Cesium from "cesium";
import LabelPoi from "@/components/simulation/render/poi/LabelPoi.vue";
import FlagIcon from "@/components/icons/FlagIcon.vue";
import {formatDate} from "@/utils";

type Props = {
  position: Cesium.Cartesian3,
  time: Date
}
const props = defineProps<Props>();
const {position, time} = toRefs(props);

const baseScene = inject("baseScene") as BaseCesiumScene;
const cartesian2Position = shallowRef<Cesium.Cartesian2>(new Cesium.Cartesian2());

const point = new Cesium.Entity({
  // 设置点的位置 (经度、纬度、高度)
  position: new Cesium.CallbackPositionProperty(() => position.value, false),
  point: {
    pixelSize: 8,        // 点的大小
    color: Cesium.Color.WHITE, // 点的颜色
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
  const cartesian2 = baseScene.cartesian3ToScreen(position.value);
  cartesian2Position.value = cartesian2 ?? new Cesium.Cartesian2(-1000, -1000);
  if (cartesian2) {
    cartesian2Position.value = cartesian2;
  } else {
    cartesian2Position.value = new Cesium.Cartesian2(-1000, -1000);
  }
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
