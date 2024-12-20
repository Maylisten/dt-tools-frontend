<template>
  <div class="h-full w-full">
    <el-scrollbar>
      <VueDraggable v-model="modelList" class="flex flex-col gap-1 p-1" handle=".handle" :animation="150">
        <TransitionGroup>
          <div
              v-for="model of modelList"
              :key="model.id"
              class="border-gray-200 border-2 rounded"
          >
            <ModelItem :value="model"/>
          </div>
        </TransitionGroup>
      </VueDraggable>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {useRenderStore} from "@/store";
import {storeToRefs} from "pinia";
import {VueDraggable} from "vue-draggable-plus";
import ModelItem from "@/components/render/manager/list/ModelItem.vue";

const renderStore = useRenderStore();
const {modelList} = storeToRefs(renderStore);

</script>

<style scoped lang="less">

</style>
