<template>
  <div class="h-screen w-screen flex flex-col">
    <div class="h-20 shadow border-b-gray-400 border-2">
      <HeaderBar/>
    </div>
    <div class="flex-1 ">
      <div class="flex flex-row h-full">
        <transition enter-active-class="animate__animated animate__fadeInLeft"
                    leave-active-class="animate__animated animate__fadeOutLeft">
          <div v-if="sidebarShow" class="h-full w-[300px] shadow">
            <SideBarMenu/>
          </div>
        </transition>
        <div class="h-full flex-1 bg-gray-300">
          <slot></slot>
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
const {sidebarShow} = storeToRefs(layoutStore);
setSidebarShow(true);

</script>

<style scoped lang="less">

</style>
