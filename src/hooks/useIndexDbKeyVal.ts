import {ref, watch} from "vue";
import {get, set} from "idb-keyval";
import {convertToPlainObject} from "@/utils";

export function useIndexDbKeyVal<T>(key: string, initialData: T) {
  const data = ref<T>(initialData);
  get(key).then((val: T) => {
    if (val) {
      data.value = val;
    } else {
      data.value = initialData;
    }
  });

  watch(data, async (newData) => {
    await set(key, convertToPlainObject(newData));
  }, {deep: true});
  return data;
}
