import {ref, watch} from "vue";
import {convertToPlainObject} from "@/utils";
import {listRenderModels, setAllRenderModels} from "@/api/render.ts";
import {Model} from "@/types/Model.ts";
import _ from "lodash";

export function useModels(projectId: string) {
  const data = ref<Model[]>([]);
  listRenderModels(projectId).then((val) => {
    if (val) {
      data.value = val;
    }
  });

  watch(data, _.debounce(async (newData) => {
    await setAllRenderModels(projectId, convertToPlainObject(newData));
  }, 500, {
    'leading': false,
    'trailing': true
  }), {deep: true});

  return data;
}
