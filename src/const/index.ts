import {Step} from "@/types/Process.ts";

export const STEP_LABEL_MAP = {
  [Step.DataCleaning]: '数据清洗',
  [Step.DataTransformation]: '数据转换',
  [Step.DataCompression]: '数据压缩',
  [Step.DataEncryption]: '数据加密',
};
