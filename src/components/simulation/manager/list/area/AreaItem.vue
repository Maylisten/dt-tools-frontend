<template>
  <div class="border-2 border-gray-200 overflow-hidden rounded">
    <CollapseItem :default-expand="true">
      <template #title>
        <ClickEditLabel v-model="data.label"/>
      </template>
      <template #content>
        <el-form>
          <el-form-item label="出现时间" class="p-2" style="margin-bottom: 0">
            <el-date-picker
                v-model="data.availability[0]"
                type="datetime"
                placeholder="选择出现时间"
            />
          </el-form-item>
          <el-form-item label="消失时间" class="p-2" style="margin-bottom: 0">
            <el-date-picker
                v-model="data.availability[1]"
                type="datetime"
                placeholder="选择消失时间"
            />
          </el-form-item>
          <el-form-item label="颜色" class="p-2" style="margin-bottom: 0">
            <el-color-picker v-model="data.color"/>
          </el-form-item>
          <el-form-item class="p-2" style="margin-bottom: 0">
            <el-button type="primary" size="small" style="width: 100%" @click="zoomIn">定位</el-button>
          </el-form-item>
          <el-form-item class="p-2" style="margin-bottom: 0">
            <el-popconfirm title="确定删除该实体吗？" @confirm="onDelete" width="200">
              <template #reference>
                <el-button type="danger" size="small" style="width: 100%">删除</el-button>
              </template>
            </el-popconfirm>
          </el-form-item>
        </el-form>
      </template>
    </CollapseItem>
  </div>
</template>

<script setup lang="ts">
import {Area} from "@/types/SimulationEntities.ts";
import {toRefs} from "vue";
import CollapseItem from "@/components/CollapseItem.vue";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import ClickEditLabel from "@/components/ClickEditLabel.vue";
import {BaseCesiumScene} from "@/components/simulation/entity/BaseCesiumScene.ts";

type Props = {
  data: Area
}
const props = defineProps<Props>();
const {data} = toRefs(props);

const simulationStore = useSimulationStore();
const {interval} = storeToRefs(simulationStore);
const {removeAreaById} = simulationStore;

const onDelete = () => {
  removeAreaById(data.value.id);
};

const zoomIn = () => {
  const baseScene = (window as any).baseScene as BaseCesiumScene;
  const viewer = baseScene.viewer;
  const foundEntity = baseScene.viewer.entities.getById(data.value.id);
  if (foundEntity) {
    viewer.flyTo(foundEntity, {duration: 1});
  } else {
    console.log('Entity with the given ID was not found');
  }
};
</script>

<style scoped lang="less">

</style>
