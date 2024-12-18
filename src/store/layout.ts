import {defineStore} from "pinia";
import {ref} from "vue";

export const useLayoutStore = defineStore("layout", () => {
  const sidebarShow = ref(false);
  const setSidebarShow = (value: boolean) => {
    sidebarShow.value = value;
  };

  const loading = ref(false);
  const beginLoading = () => {
    loading.value = true;
  };

  const endLoading = () => {
    loading.value = false;
  };

  return {
    sidebarShow,
    setSidebarShow,
    loading,
    beginLoading,
    endLoading
  };
});
