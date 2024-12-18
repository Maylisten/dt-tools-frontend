import {defineStore} from "pinia";
import {ref} from "vue";

export const useLayoutStore = defineStore("layout", () => {
  const sidebarShow = ref(false);
  const setSidebarShow = (value: boolean) => {
    sidebarShow.value = value;
  };

  return {
    sidebarShow,
    setSidebarShow
  };
});
