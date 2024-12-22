import {Project} from "@/types/Project.ts";
import {get, post} from "@/utils/axios.ts";

export async function listProjects() {
  return get<Project[]>("/project/list");
}

export async function addProject(name: string) {
  return post<Project>("/project/add", {name});
}

export async function removeProject(projectId: string) {
  return await get(`/project/delete?projectId=${projectId}`);
}
