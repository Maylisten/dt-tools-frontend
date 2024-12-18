import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {Project} from "@/types/Project.ts";
import {addProject as addProject_, listProjects} from "@/api/project.ts";

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

  return {
    projects,
    updateProjects,
    currentProjectId,
    setCurrentProjectId,
    currentProject,
    addProject
  };
});
