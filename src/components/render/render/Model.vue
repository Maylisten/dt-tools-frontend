<template>
  <div>{{ model }}</div>
</template>

<script setup lang="ts">
import {Model} from "@/types/Model.ts";
import {toRefs} from "vue";

type Props = {
  data: Model
}
const props = defineProps<Props>();
const {data: model} = toRefs(props);

</script>

<style scoped lang="less">

</style>
