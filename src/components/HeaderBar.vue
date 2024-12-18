<template>
  <div class="h-full px-5 flex justify-between items-center">
    <div class="h-full w-fit flex flex-row items-center text-2xl font-bold font-mono text-primary-500">
      <ToolboxIcon class="mr-2 text-3xl"/>
      <span>社会治理数字孪生工具集</span>
    </div>
    <div v-if="!isProjectPage" class="flex flex-row items-center gap-6">
      <span class="text-primary-400 text-xl">当前场景：{{ currentProject?.name }}</span>
      <router-link class="text-gray-600 text-xl hover:cursor-pointer hover:text-primary-400"
                   to="/project">
        <SwitchIcon/>
      </router-link>
    </div>

  </div>
</template>

<script setup lang="ts">

import ToolboxIcon from "@/components/icons/ToolboxIcon.vue";
import {computed} from "vue";
import {useRoute} from "vue-router";
import {useProjectStore} from "@/store";
import SwitchIcon from "@/components/icons/SwitchIcon.vue";
import {storeToRefs} from "pinia";

const route = useRoute();
const isProjectPage = computed(() => route.path === "/project");

const projectStore = useProjectStore();
const {currentProject} = storeToRefs(projectStore);

</script>

<style scoped lang="less">

</style>
