import {ref, watch} from "vue";
import {convertToPlainObject} from "@/utils";
import {listRenderModels, setAllRenderModels} from "@/api/render.ts";
import {Model} from "@/types/Model.ts";

export function useModels(projectId: string) {
  const data = ref<Model[]>([]);
  listRenderModels(projectId).then((val) => {
    if (val) {
      data.value = val;
    }
  });

  watch(data, async (newData) => {
    await setAllRenderModels(projectId, convertToPlainObject(newData));
  }, {deep: true});

  return data;
}
