import {Step} from "@/types/Process.ts";
import {
  FlameConfig,
  GlbConfig,
  GltfConfig,
  ModelConfigMap,
  ModelType,
  ObjConfig,
  SmokeConfig,
  WaterConfig
} from "@/types/Model.ts";

export const STEP_LABEL_MAP = {
  [Step.DataClean]: '数据清洗',
  [Step.DataSample]: '数据采样',
  [Step.DataEncryption]: '数据加密',
  [Step.DataDecryption]: '数据解密',
  [Step.DataCompression]: '数据压缩'

};

export const MODEL_TYPE_LABEL_MAP = {
  [ModelType.GLB]: 'glb 模型',
  [ModelType.GLTF]: 'gltf 模型',
  [ModelType.OBJ]: 'obj 模型',
  [ModelType.FLAME]: '火焰模型',
  [ModelType.SMOKE]: '烟雾模型',
  [ModelType.WATER]: '水流模型',
};

export const MODEL_TYPE_TAG_COLOR_MAP = {
  [ModelType.GLB]: '#D7B273',
  [ModelType.GLTF]: '#945E89',
  [ModelType.OBJ]: '#5FB28E',
  [ModelType.FLAME]: '#E08780',
  [ModelType.SMOKE]: '#b3b1b1',
  [ModelType.WATER]: '#ACD6EC',
};
export const MODEL_DEFAULT_CONFIG: ModelConfigMap = {
  [ModelType.GLB]: {
    url: "",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    size: 1,
  } as GlbConfig,
  [ModelType.GLTF]: {
    url: "",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    size: 1,
  } as GltfConfig,
  [ModelType.OBJ]: {
    objUrl: "",
    mtlUrl: "",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    size: 1,
  } as ObjConfig,
  [ModelType.FLAME]: {
    position: [0, 0, 0],
  } as FlameConfig,
  [ModelType.SMOKE]: {
    position: [0, 0, 0],
    size: 3
  } as SmokeConfig,
  [ModelType.WATER]: {
    size: [5, 5],
    position: [0, 0, 0],
  } as WaterConfig,
};

export const MODEL_MAIN_FILE_EXTENSION = {
  [ModelType.GLB]: 'glb',
  [ModelType.GLTF]: 'gltf',
  [ModelType.OBJ]: 'obj',
  [ModelType.FLAME]: '',
  [ModelType.WATER]: ''
};
