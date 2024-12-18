<template>
  <el-menu class="h-full" :default-active="activePath" @select="handleMenuSelect">

    <template v-for="menu in menus" :key="menu.path">
      <template v-if="menu.children && menu.children.length > 0">
        <el-sub-menu :index="menu.children[0].path">
          <template #title>
            <div class="flex flex-row items-center gap-4 text-base select-none">
              <Component :is="menu.icon" class="scale-125"/>
              <span>{{ menu.title }}</span>
            </div>
          </template>
          <el-menu-item v-for="subMenu in menu.children" :key="subMenu.path" :index="subMenu.path">
            <div class="flex flex-row items-center gap-4 text-base select-none">
              <span>{{ subMenu.title }}</span>
            </div>
          </el-menu-item>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item :index="menu.path">
          <div class="flex flex-row items-center gap-4 text-base select-none">
            <Component :is="menu.icon" class="scale-125"/>
            <span>{{ menu.title }}</span>
          </div>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import BigDataIcon from "@/components/icons/BigDataIcon.vue";
import ModelBuilderIcon from "@/components/icons/ModelBuilderIcon.vue";
import ModelRenderIcon from "@/components/icons/ModelRenderIcon.vue";
import ScriptIcon from "@/components/icons/ScriptIcon.vue";
import DisplayIcon from "@/components/icons/DisplayIcon.vue";
import {onMounted, ref, shallowRef, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const menus = shallowRef([
  {
    title: "多源治理大数据处理",
    path: "/process",
    icon: BigDataIcon,
    children: [
      {
        title: "数据处理",
        path: "/process/flow",
      },
      {
        title: "数据管理",
        path: "/process/manage",
      },
    ]
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

const route = useRoute();

const activePath = ref("");

const handleMenuSelect = (index: string) => {
  router.push({path: index, query: {projectId: route.query.projectId}});
};

watch(route, (value) => {
  activePath.value = value.path;
});

onMounted(() => {
  activePath.value = route.path;
});

</script>

<style scoped lang="less">

</style>
