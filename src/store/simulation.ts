import {defineStore, storeToRefs} from "pinia";
import {computed, ref} from "vue";
import * as Cesium from "cesium";
import {SimulationEditMode} from "@/types/SimulationEditMode.ts";
import {PathPoint} from "@/types/SimulationEntities.ts";
import _ from "lodash";
import {v1 as uuid} from "uuid";
import {
  useSimulationAreas,
  useSimulationLines,
  useSimulationPaths,
  useSimulationPoints
} from "@/hooks/useSimulationEntitiesStore.ts";
import {useProjectStore} from "@/store/project.ts";

export const useSimulationStore = defineStore("simulation", () => {
  const projectStore = useProjectStore();
  const {currentProjectId} = storeToRefs(projectStore);

  const interval = ref<[Date, Date]>([new Date(), new Date(new Date().getTime() + 30 * 60 * 1000)]);
  const julianDateInterval = computed(() => interval.value.map(t => Cesium.JulianDate.fromDate(t)) as [Cesium.JulianDate, Cesium.JulianDate]);
  const setInterval = (value: [Date, Date]) => {
    interval.value = value;
  };

  const currentDate = ref<Date>(new Date());
  const setCurrentDate = (value: Date) => {
    currentDate.value = value;
  };
  const currentJulianDate = computed(() => Cesium.JulianDate.fromDate(currentDate.value));

  const editingMode = ref<SimulationEditMode>(SimulationEditMode.NONE);
  const enterPointEditingMode = () => {
    editingMode.value = SimulationEditMode.POINT;
  };
  const enterLineEditingMode = () => {
    editingMode.value = SimulationEditMode.LINE;
  };
  const enterAreaEditingMode = () => {
    editingMode.value = SimulationEditMode.AREA;
  };
  const enterPathEditingMode = () => {
    editingMode.value = SimulationEditMode.PATH;
  };
  const exitEditingMode = () => {
    editingMode.value = SimulationEditMode.NONE;
  };

  const points = useSimulationPoints(currentProjectId.value!);
  const lines = useSimulationLines(currentProjectId.value!);
  const areas = useSimulationAreas(currentProjectId.value!);
  const paths = useSimulationPaths(currentProjectId.value!);

  const createPoint = (position: [number, number, number]) => {
    points.value.push({
      id: uuid(),
      label: "新建点",
      position,
      availability: _.cloneDeep(interval.value),
      color: "#0000F5"
    });
  };

  const createLine = (positions: [number, number, number][]) => {
    lines.value.push({
      id: uuid(),
      label: "新建线",
      positions,
      availability: _.cloneDeep(interval.value),
      color: "#0000F5"
    });
  };

  const createArea = (positions: [number, number, number][]) => {
    areas.value.push({
      id: uuid(),
      label: "新建面",
      positions,
      availability: _.cloneDeep(interval.value),
      color: "#0000F5"
    });
  };

  const createPath = (points: PathPoint[]) => {
    console.log(points);
    paths.value.push({
      id: uuid(),
      label: "新建路径",
      points,
      availability: _.cloneDeep(interval.value),
    });
  };

  const removePointById = (id: string) => {
    points.value = points.value.filter(p => p.id !== id);
  };

  const removeLineById = (id: string) => {
    lines.value = lines.value.filter(p => p.id !== id);
  };

  const removeAreaById = (id: string) => {
    areas.value = areas.value.filter(p => p.id !== id);
  };

  const removePathById = (id: string) => {
    paths.value = paths.value.filter(p => p.id !== id);
  };

  return {
    interval,
    julianDateInterval,
    setInterval,
    currentDate,
    currentJulianDate,
    setCurrentDate,
    editingMode,
    points,
    lines,
    areas,
    paths,
    createPoint,
    createLine,
    createArea,
    createPath,
    removePointById,
    removeLineById,
    removeAreaById,
    removePathById,
    enterPointEditingMode,
    enterLineEditingMode,
    enterAreaEditingMode,
    enterPathEditingMode,
    exitEditingMode
  };
});
