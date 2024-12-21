<template>
  <CollapseItem>
    <template #title>
      <div class="flex flex-row items-center">
        <ListIcon class="handle cursor-move border-gray-500 text-xl font-bold"/>
        <ModelTag class="mx-2" :type="model.type"/>
        <div>{{ model.name }}</div>
      </div>
    </template>
    <template #content>
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
    </template>
  </CollapseItem>
</template>

<script setup lang="ts">
import {Model, ModelType} from "@/types/Model.ts";
import {toRefs} from "vue";
import ListIcon from "@/components/icons/ListIcon.vue";
import GlbItemEditor from "@/components/render/manager/list/GlbItemEditor.vue";
import GltfItemEditor from "@/components/render/manager/list/GltfItemEditor.vue";
import ObjItemEditor from "@/components/render/manager/list/ObjItemEditor.vue";
import FlameItemEditor from "@/components/render/manager/list/FlameItemEditor.vue";
import WaterItemEditor from "@/components/render/manager/list/WaterItemEditor.vue";
import ModelTag from "@/components/render/ModelTag.vue";
import {useRenderStore} from "@/store";
import CollapseItem from "@/components/CollapseItem.vue";

const renderStore = useRenderStore();
const {removeModel} = renderStore;

const props = defineProps<{ value: Model }>();
const {value: model} = toRefs(props);

const onDelete = () => {
  removeModel(model.value);
};

</script>

<style scoped lang="less">

</style>
