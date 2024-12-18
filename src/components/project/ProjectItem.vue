<template>
  <div
      class="w-80 h-56 bg-white border-gray-300 border-2 rounded hover:cursor-pointer hover:scale-105 transition-transform flex flex-row justify-center items-center text-2xl"
      @click="handleClick"
  >
    {{ props.name }}
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['click']);

type Props = {
  id: string,
  name: string
}
const props = withDefaults(defineProps<Props>(), {
  id: "",
  name: ""
});

const handleClick = () => {
  emit('click', props.id);
};

</script>

<style scoped lang="less">

</style>
