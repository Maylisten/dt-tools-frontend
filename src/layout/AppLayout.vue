<template>
  <div class="h-screen w-screen flex flex-col" v-loading="loading">
    <div class="h-16 shadow border-b-gray-400 border-2">
      <HeaderBar/>
    </div>
    <div class="flex-1 ">
      <div class="flex flex-row h-full">
        <div v-if="sidebarShow" class="h-full w-[300px] shadow">
          <SideBarMenu/>
        </div>
        <div class="h-full flex-1 bg-gray-100  relative">
          <div class="absolute top-0 left-0 h-full w-full overflow-hidden">
            <el-scrollbar>
              <slot></slot>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useLayoutStore} from "@/store";
import {storeToRefs} from "pinia";
import SideBarMenu from "@/components/SideBarMenu.vue";
import HeaderBar from "@/components/HeaderBar.vue";

const layoutStore = useLayoutStore();
const {setSidebarShow} = layoutStore;
const {sidebarShow, loading} = storeToRefs(layoutStore);
setSidebarShow(true);

</script>

<style scoped lang="less">

</style>
