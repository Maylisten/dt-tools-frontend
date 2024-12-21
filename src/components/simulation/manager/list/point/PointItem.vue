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
        </el-form>
      </template>
    </CollapseItem>
  </div>
</template>

<script setup lang="ts">
import {Point} from "@/types/SimulationEntities.ts";
import {toRefs} from "vue";
import CollapseItem from "@/components/CollapseItem.vue";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";
import ClickEditLabel from "@/components/ClickEditLabel.vue";

type Props = {
  data: Point
}
const props = defineProps<Props>();
const {data} = toRefs(props);

const simulationStore = useSimulationStore();
const {interval} = storeToRefs(simulationStore);

</script>

<style scoped lang="less">

</style>
