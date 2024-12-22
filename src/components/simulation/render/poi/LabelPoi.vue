<template>
  <div
      class="absolute w-fit h-fit min-w-[100px] min-h-[30px] p-2 flex flex-row justify-center items-center bg-white/80 text-primary-400 -translate-x-1/2 -translate-y-full rounded"
      :style="positionStyle"
  >
    <div> {{ label }}</div>
    <slot></slot>
    <div class="triangle"></div>
  </div>
</template>

<script setup lang="ts">
import {computed, toRefs} from "vue";

type Props = {
  label?: string,
  position: { x: number, y: number },
  width?: string
}

const props = defineProps<Props>();
const {label, position, width} = toRefs(props);

const positionStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y - 30}px`,
  "min-width": width.value
}));
</script>

<style scoped lang="less">
.triangle {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%) translateY(95%);
  width: 20px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  clip-path: polygon(0 0, 50% 100%, 100% 0);
}
</style>
