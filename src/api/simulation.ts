import {get, post} from "@/utils/axios.ts";
import {Area, Line, Path, Point} from "@/types/SimulationEntities.ts";

export async function listSimulationPoints(projectId: string) {
  return await get<Point[]>(`/simulation/point/list?projectId=${projectId}`);
}

export async function listSimulationLines(projectId: string) {
  return await get<Line[]>(`/simulation/line/list?projectId=${projectId}`);
}

export async function listSimulationAreas(projectId: string) {
  return await get<Area[]>(`/simulation/area/list?projectId=${projectId}`);
}

export async function listSimulationPaths(projectId: string) {
  return await get<Path[]>(`/simulation/path/list?projectId=${projectId}`);
}

export async function setSimulationPoints(projectId: string, points: Point[]) {
  return await post<Point[]>('/simulation/point/set', {projectId, points});
}

export async function setSimulationLines(projectId: string, lines: Line[]) {
  return await post<Line[]>('/simulation/line/set', {projectId, lines});
}

export async function setSimulationAreas(projectId: string, areas: Area[]) {
  return await post<Area[]>('/simulation/area/set', {projectId, areas});
}

export async function setSimulationPaths(projectId: string, paths: Path[]) {
  return await post<Path[]>('/simulation/path/set', {projectId, paths});
}

