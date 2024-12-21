import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import ProjectPage from "@/pages/ProjectPage.vue";
import RenderPage from "@/pages/RenderPage.vue";
import SimulationPage from "@/pages/SimulationPage.vue";
import ControlPage from "@/pages/ControlPage.vue";
import {useLayoutStore, useProjectStore} from "@/store";
import {createPinia, setActivePinia} from "pinia";
import DataProcessManagePage from "@/pages/process/DataProcessManagePage.vue";
import DataProcessFlowPage from "@/pages/process/DataProcessFlowPage.vue";
import TestPage from "@/pages/TestPage.vue";
import ModelPage from "@/pages/ModelPage/ModelPage.vue";

const routes: Readonly<RouteRecordRaw[]> = [
  {path: '/', redirect: "/project"},
  {path: "/project", component: ProjectPage},
  {path: "/process/flow", component: DataProcessFlowPage},
  {path: "/process/manage", component: DataProcessManagePage},
  {path: "/model", component: ModelPage},
  {path: "/render", component: RenderPage},
  {path: "/simulation", component: SimulationPage},
  {path: "/control", component: ControlPage},
  {path: "/test", component: TestPage},
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 没有选择场景（项目）时，重定向到场景界面
router.beforeEach((to, _, next) => {
  const projectId = to.query.projectId as string | undefined;
  const projectStore = useProjectStore();
  const {setCurrentProjectId} = projectStore;
  const layoutStore = useLayoutStore();
  const {setSidebarShow} = layoutStore;

  if (to.path === "/project") {
    // 收起侧边栏
    setSidebarShow(false);
    // 清除 url query
    if (projectId !== undefined) {
      next("/project");
    } else {
      next();
    }
  } else {
    if (!projectId) {
      next("/project");
    } else {
      // 展开侧边栏
      setSidebarShow(true);
      // 设置 pinia
      setActivePinia(createPinia());
      setCurrentProjectId(projectId);
      next();
    }
  }
});
