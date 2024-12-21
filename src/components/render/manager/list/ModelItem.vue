<template>
  <div
      class="h-50px px-2  flex items-center select-none transition  h-[50px] shadow border-2 border-gray-100">
    <ListIcon class="handle cursor-move border-gray-500 text-xl font-bold"/>
    <ModelTag class="mx-2" :type="model.type"/>
    <div>{{ model.name }}</div>
    <el-icon v-if="isExpand" class="hover:cursor-pointer hover:text-primary-400 ml-auto" @click="isExpand = false">
      <CaretTop/>
    </el-icon>
    <el-icon v-if="!isExpand" class="hover:cursor-pointer hover:text-primary-400 ml-auto" @click="isExpand = true">
      <CaretBottom/>
    </el-icon>
  </div>
  <el-collapse-transition>
    <div v-show="isExpand" class="h-fit bg-gray-100">
      <GlbItemEditor v-if="model.type === ModelType.GLB" :value="model"/>
      <GltfItemEditor v-else-if="model.type === ModelType.GLTF" :value="model"/>
      <ObjItemEditor v-else-if="model.type === ModelType.OBJ" :value="model"/>
      <FlameItemEditor v-else-if="model.type === ModelType.FLAME" :value="model"/>
      <WaterItemEditor v-else-if="model.type === ModelType.WATER" :value="model"/>
      <div>
        <el-popconfirm title="确定删除该模型吗？" @confirm="onDelete" width="200">
          <template #reference>
            <el-button type="danger" class="w-full" plain size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </el-collapse-transition>
</template>

<script setup lang="ts">
import {Model, ModelType} from "@/types/Model.ts";
import {ref, toRefs} from "vue";
import ListIcon from "@/components/icons/ListIcon.vue";
import GlbItemEditor from "@/components/render/manager/list/GlbItemEditor.vue";
import {CaretBottom, CaretTop} from "@element-plus/icons-vue";
import GltfItemEditor from "@/components/render/manager/list/GltfItemEditor.vue";
import ObjItemEditor from "@/components/render/manager/list/ObjItemEditor.vue";
import FlameItemEditor from "@/components/render/manager/list/FlameItemEditor.vue";
import WaterItemEditor from "@/components/render/manager/list/WaterItemEditor.vue";
import ModelTag from "@/components/render/ModelTag.vue";
import {useRenderStore} from "@/store";

const renderStore = useRenderStore();
const {removeModel} = renderStore;

const props = defineProps<{ value: Model }>();
const {value: model} = toRefs(props);

const isExpand = ref(false);

const onDelete = () => {
  removeModel(model.value);
};

</script>

<style scoped lang="less">

</style>
