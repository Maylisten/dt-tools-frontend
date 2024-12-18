<template>
  <div class="max-h-full w-full p-10">
    <div class="text-2xl  mb-10">社会治理场景列表</div>
    <div class="w-full flex flex-wrap gap-10">
      <ProjectItem v-for="project of projects" :key="project.id" :id="project.id" :name="project.name"
                   @click="handleItemClick"/>
      <ProjectAddButton/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useProjectStore} from "@/store";
import {onMounted} from "vue";
import ProjectItem from "@/components/project/ProjectItem.vue";
import ProjectAddButton from "@/components/project/ProjectAddButton.vue";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";

const projectStore = useProjectStore();
const {setCurrentProjectId, updateProjects} = projectStore;
const {projects} = storeToRefs(projectStore);
const router = useRouter();

const handleItemClick = async (id: string) => {
  await router.push({path: "/process/flow", query: {projectId: id}});
};

const clearCurrentProject = () => {
  setCurrentProjectId(undefined);
};

onMounted(async () => {
  clearCurrentProject();
  await updateProjects();
});

</script>

<style scoped lang="less">

</style>
