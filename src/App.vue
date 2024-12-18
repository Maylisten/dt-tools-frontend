<template>
  <AppLayout>
    <router-view/>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/layout/AppLayout.vue";
import {useProjectStore} from "@/store";

const projectStore = useProjectStore();
const {updateProjects} = projectStore;
updateProjects();

</script>

<style scoped>

</style>
