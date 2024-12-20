import {defineStore, storeToRefs} from "pinia";
import {Model} from "@/types/Model.ts";
import {useModels} from "@/hooks/useModels.ts";
import {useProjectStore} from "@/store/project.ts";

export const useRenderStore = defineStore("render", () => {
  const projectStore = useProjectStore();
  const {currentProjectId} = storeToRefs(projectStore);
  const modelList = useModels(currentProjectId.value!);

  const addModel = (model: Model) => {
    modelList.value.push(model);
  };

  const removeModel = (model: Model) => {
    removeModelById(model.id);
  };

  const removeModelById = (id: string) => {
    modelList.value = modelList.value.filter((m) => m.id !== id);
  };

  return {modelList, addModel, removeModel, removeModelById};
});
