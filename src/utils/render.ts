import {DRACOLoader, GLTFLoader, MTLLoader, OBJLoader} from "three-stdlib";

export function getGltfLoader() {
  const dracoLoader = new DRACOLoader();
  const gltfLoader = new GLTFLoader().setPath(import.meta.env.VITE_APP_BASE_URL);
  gltfLoader.setDRACOLoader(dracoLoader);
  return gltfLoader;
}

export function getMtlLoader() {
  return new MTLLoader().setPath(import.meta.env.VITE_APP_BASE_URL);
}

export function getOBJLoader() {
  return new OBJLoader().setPath(import.meta.env.VITE_APP_BASE_URL);
}

// 角度转弧度
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// 弧度转角度
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
