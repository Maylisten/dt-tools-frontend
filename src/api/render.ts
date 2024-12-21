import {get, post} from "@/utils/axios.ts";
import {Model} from "@/types/Model.ts";

export async function uploadFile(basePath: string, name: string, file: File) {
  const uploadUrl = '/upload/file';
  // console.log("upload file", `${basePath}/${name}`);
  const formData = new FormData();
  formData.append('basePath', basePath);
  formData.append('name', name);
  formData.append('file', file);
  return await post(uploadUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
}

export async function uploadDirectory(basePath: string, name: string) {
  const uploadUrl = '/upload/directory';
  // console.log("upload directory", `${basePath}/${name}`);
  return await post(uploadUrl, {basePath, name});
}

export async function listRenderModels(projectId: string) {
  return await get<Model[]>(`/render/list?projectId=${projectId}`);
}

export async function setAllRenderModels(projectId: string, models: Model[]) {
  return await post<Model[]>('/render/set_all', {projectId, models});
}

