import {ref, watch} from "vue";
import {convertToPlainObject, parseDatesInObject} from "@/utils";
import _ from "lodash";
import {Area, Line, Path, Point} from "@/types/SimulationEntities.ts";
import {
  listSimulationAreas,
  listSimulationLines,
  listSimulationPaths,
  listSimulationPoints,
  setSimulationAreas,
  setSimulationLines,
  setSimulationPaths,
  setSimulationPoints
} from "@/api/simulation.ts";

export function useSimulationPoints(projectId: string) {
  const data = ref<Point[]>([]);
  listSimulationPoints(projectId).then((val) => {
    if (val) {
      data.value = parseDatesInObject(val);
    }
  });

  watch(data, _.debounce(async (newData) => {
    await setSimulationPoints(projectId, convertToPlainObject(newData));
  }, 500, {
    'leading': false,
    'trailing': true
  }), {deep: true});
  return data;
}

export function useSimulationLines(projectId: string) {
  const data = ref<Line[]>([]);
  listSimulationLines(projectId).then((val) => {
    if (val) {
      data.value = parseDatesInObject(val);
    }
  });

  watch(data, _.debounce(async (newData) => {
    await setSimulationLines(projectId, convertToPlainObject(newData));
  }, 500, {
    'leading': false,
    'trailing': true
  }), {deep: true});
  return data;
}

export function useSimulationAreas(projectId: string) {
  const data = ref<Area[]>([]);
  listSimulationAreas(projectId).then((val) => {
    if (val) {
      data.value = parseDatesInObject(val);
    }
  });

  watch(data, _.debounce(async (newData) => {
    await setSimulationAreas(projectId, convertToPlainObject(newData));
  }, 500, {
    'leading': false,
    'trailing': true
  }), {deep: true});
  return data;
}

export function useSimulationPaths(projectId: string) {
  const data = ref<Path[]>([]);
  listSimulationPaths(projectId).then((val) => {
    if (val) {
      data.value = parseDatesInObject(val);
    }
  });

  watch(data, _.debounce(async (newData) => {
    await setSimulationPaths(projectId, convertToPlainObject(newData));
  }, 500, {
    'leading': false,
    'trailing': true
  }), {deep: true});
  return data;
}
