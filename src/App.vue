<template>
  <AppLayout>
    <router-view/>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";
import {useProjectStore} from "@/store";

document.title = "数字孪生工具集";
const projectStore = useProjectStore();
const {updateProjects} = projectStore;
updateProjects();

</script>

<style scoped>

</style>
