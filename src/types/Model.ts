export type GlbConfig = {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
}

export type GltfConfig = {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
}

export type ObjConfig = {
  objUrl: string;
  mtlUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
}

export type FlameConfig = {
  position: [number, number, number];
}

export type WaterConfig = {
  size: [number, number];
  position: [number, number, number];
}

export type ModelConfig = GlbConfig | GltfConfig | ObjConfig | FlameConfig | WaterConfig;

export type ModelConfigMap = {
  [ModelType.GLB]: GlbConfig;
  [ModelType.GLTF]: GltfConfig;
  [ModelType.OBJ]: ObjConfig;
  [ModelType.FLAME]: FlameConfig;
  [ModelType.WATER]: WaterConfig;
};

export enum ModelType {
  GLB = "GLB",
  GLTF = "GLTF",
  OBJ = "OBJ",
  FLAME = "FLAME",
  WATER = "WATER"
}

export interface Model {
  id: string;
  name: string;
  type: ModelType;
  config: ModelConfig
}
