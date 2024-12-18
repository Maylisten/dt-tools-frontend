<template>
  <el-menu router>
    <el-menu-item v-for="menu of menus" :key="menu.path" :index="menu.path">
      <div class="flex flex-row items-center gap-4 text-base select-none">
        <Component :is="menu.icon" class="scale-125"/>
        <span>{{ menu.title }}</span>
      </div>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import BigDataIcon from "@/components/icons/BigDataIcon.vue";
import ModelBuilderIcon from "@/components/icons/ModelBuilderIcon.vue";
import ModelRenderIcon from "@/components/icons/ModelRenderIcon.vue";
import ScriptIcon from "@/components/icons/ScriptIcon.vue";
import DisplayIcon from "@/components/icons/DisplayIcon.vue";
import {shallowRef} from "vue";

const menus = shallowRef([
  {
    title: "多源治理大数据处理",
    path: "/process",
    icon: BigDataIcon
  },
  {
    title: "孪生体数字化建模",
    path: "/model",
    icon: ModelBuilderIcon
  },
  {
    title: "市域治理场景渲染",
    path: "/render",
    icon: ModelRenderIcon
  },
  {
    title: "社会治理场景交互式仿真",
    path: "/simulation",
    icon: ScriptIcon
  },
  {
    title: "社会治理事件调控",
    path: "/control",
    icon: DisplayIcon
  },
]);
</script>

<style scoped lang="less">

</style>
