import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {Project} from "@/types/Project.ts";
import {addProject as addProject_, listProjects, removeProject as removeProject_} from "@/api/project.ts";

export const useProjectStore = defineStore("project", () => {
  const projects = ref<Project[]>([]);
  const updateProjects = async () => {
    projects.value = await listProjects();
  };

  const currentProjectId = ref<string | undefined>(undefined);
  const setCurrentProjectId = (id: string | undefined) => {
    currentProjectId.value = id;
  };

  const currentProject = computed(() => {
    return projects.value.find(item => item.id === currentProjectId.value);
  });

  const addProject = async (name: string) => {
    const project = await addProject_(name);
    await updateProjects();
    return project;
  };

  const removeProject = async (id: string) => {
    const count = await removeProject_(id) as number;
    await updateProjects();
    return count;
  };

  return {
    projects,
    updateProjects,
    currentProjectId,
    setCurrentProjectId,
    currentProject,
    addProject,
    removeProject
  };
});
