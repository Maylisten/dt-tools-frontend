import {Step} from "@/types/Process.ts";
import {FlameConfig, GlbConfig, GltfConfig, ModelConfigMap, ModelType, ObjConfig, WaterConfig} from "@/types/Model.ts";

export const STEP_LABEL_MAP = {
  [Step.DataCleaning]: '数据清洗',
  [Step.DataTransformation]: '数据转换',
  [Step.DataCompression]: '数据压缩',
  [Step.DataEncryption]: '数据加密',
};

export const MODEL_TYPE_LABEL_MAP = {
  [ModelType.GLB]: 'glb 模型',
  [ModelType.GLTF]: 'gltf 模型',
  [ModelType.OBJ]: 'obj 模型',
  [ModelType.FLAME]: '火焰模型',
  [ModelType.WATER]: '水流模型',
};

export const MODEL_TYPE_TAG_COLOR_MAP = {
  [ModelType.GLB]: '#D7B273',
  [ModelType.GLTF]: '#945E89',
  [ModelType.OBJ]: '#5FB28E',
  [ModelType.FLAME]: '#E08780',
  [ModelType.WATER]: '#ACD6EC',
};
export const MODEL_DEFAULT_CONFIG: ModelConfigMap = {
  [ModelType.GLB]: {
    url: "",
    position: [0, 0, 0],
  } as GlbConfig,
  [ModelType.GLTF]: {
    url: "",
    position: [0, 0, 0],
  } as GltfConfig,
  [ModelType.OBJ]: {
    url: "",
    position: [0, 0, 0],
  } as ObjConfig,
  [ModelType.FLAME]: {
    position: [0, 0, 0],
  } as FlameConfig,
  [ModelType.WATER]: {
    size: [50, 50],
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
