import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import ProjectPage from "@/pages/ProjectPage.vue";
import DataProcessPage from "@/pages/DataProcessPage.vue";
import ModelPage from "@/pages/ModelPage.vue";
import RenderPage from "@/pages/RenderPage.vue";
import SimulationPage from "@/pages/SimulationPage.vue";
import ControlPage from "@/pages/ControlPage.vue";

const routes: Readonly<RouteRecordRaw[]> = [
  {path: '/', redirect: "/project"},
  {path: "/project", component: ProjectPage},
  {path: "/process", component: DataProcessPage},
  {path: "/model", component: ModelPage},
  {path: "/render", component: RenderPage},
  {path: "/simulation", component: SimulationPage},
  {path: "/control", component: ControlPage},
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
