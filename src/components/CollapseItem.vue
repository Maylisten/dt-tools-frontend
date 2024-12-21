<template>
  <div
      class="h-50px px-2  flex items-center select-none transition  h-[50px] shadow border-2 border-gray-100">
    <div class="flex-1">
      <slot name="title"></slot>
    </div>
    <el-icon v-if="isExpand" class="hover:cursor-pointer hover:text-primary-400 ml-auto" @click="isExpand = false">
      <CaretTop/>
    </el-icon>
    <el-icon v-if="!isExpand" class="hover:cursor-pointer hover:text-primary-400 ml-auto" @click="isExpand = true">
      <CaretBottom/>
    </el-icon>
  </div>
  <el-collapse-transition>
    <div v-show="isExpand" class="h-fit bg-gray-100">
      <slot name="content"></slot>
    </div>
  </el-collapse-transition>
</template>

<script setup lang="ts">
import {ref, toRefs} from "vue";
import {CaretBottom, CaretTop} from "@element-plus/icons-vue";

type Props = {
  defaultExpand?: boolean
}
const props = withDefaults(defineProps<Props>(), {defaultExpand: false});
const {defaultExpand} = toRefs(props);

const isExpand = ref(defaultExpand.value);

</script>

<style scoped lang="less">

</style>
