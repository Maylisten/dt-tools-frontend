<template>
  <el-tag :color="color" effect="dark" :hit="false" style="border: 0px">{{ type }}</el-tag>
</template>

<script setup lang="ts">
import {ModelType} from "@/types/Model.ts";
import {computed, toRefs} from "vue";
import {MODEL_TYPE_TAG_COLOR_MAP} from "@/const";

type Props = {
  type: ModelType
}
const props = defineProps<Props>();
const {type} = toRefs(props);

const color = computed(() => MODEL_TYPE_TAG_COLOR_MAP[type.value]);

</script>

<style scoped lang="less">

</style>
