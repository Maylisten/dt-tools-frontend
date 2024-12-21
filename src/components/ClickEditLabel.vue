<template>
  <span v-show="!labelEditing" class="flex flex-row items-center w-fit hover:cursor-pointer"
        @click="beginLabelEditing">
    {{ label }}
  </span>
  <el-input v-show="labelEditing" ref="labelInputRef" v-model="label" @blur="endLabelEditing"
            @keydown.enter="endLabelEditing"
            autofocus/>
</template>

<script setup lang="ts">
import {ref} from "vue";

const label = defineModel();

const labelEditing = ref(false);
const labelInputRef = ref();
const beginLabelEditing = () => {
  labelEditing.value = true;
  setTimeout(() => {
    (labelInputRef.value as any).focus();
  });
};

const endLabelEditing = () => {
  labelEditing.value = false;
};

</script>

<style scoped lang="less">

</style>
