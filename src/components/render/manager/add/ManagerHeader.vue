<template>
  <div>
    <el-button type="primary" class="w-full min-h-[40px]" style="border-radius: 0" @click="openDialog"> +
      添加模型
    </el-button>
    <el-dialog v-model="dialogVisible" title="添加模型" width="600">
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="模型名称">
          <el-input v-model="modelFormData.name" placeholder="请输入模型名称"/>
        </el-form-item>
        <el-form-item label="模型类型">
          <el-select v-model="modelFormData.type" placeholder="Select" @change="handleSelectChange">
            <el-option
                v-for="item in typeSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <GlbModelConfigFormItems ref="configFormRef" v-if="modelFormData.type === ModelType.GLB"
                                 v-model="modelFormData.config as GlbConfig"/>
        <GltfModelConfigFormItems ref="configFormRef" v-if="modelFormData.type === ModelType.GLTF"
                                  v-model="modelFormData.config as GltfConfig"/>
        <ObjModelConfigFormItems ref="configFormRef" v-else-if="modelFormData.type === ModelType.OBJ"
                                 v-model="modelFormData.config as ObjConfig"/>
        <FlameModelConfigFormItems ref="configFormRef" v-else-if="modelFormData.type === ModelType.FLAME"
                                   v-model="modelFormData.config as FlameConfig"/>
        <WaterModelConfigFormItems ref="configFormRef" v-else-if="modelFormData.type === ModelType.WATER"
                                   v-model="modelFormData.config as WaterConfig"/>
        <el-form-item>
          <div class="w-full flex flex-row justify-end">
            <el-button @click="resetForm">重置</el-button>
            <el-button type="primary" @click="onSubmit">创建</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {FlameConfig, GlbConfig, GltfConfig, Model, ModelType, ObjConfig, WaterConfig} from "@/types/Model.ts";
import {MODEL_DEFAULT_CONFIG, MODEL_TYPE_LABEL_MAP} from "@/const";
import GltfModelConfigFormItems from "@/components/render/manager/add/GltfModelConfigFormItems.vue";
import ObjModelConfigFormItems from "@/components/render/manager/add/ObjModelConfigFormItems.vue";
import FlameModelConfigFormItems from "@/components/render/manager/add/FlameModelConfigFormItems.vue";
import WaterModelConfigFormItems from "@/components/render/manager/add/WaterModelConfigFormItems.vue";
import GlbModelConfigFormItems from "@/components/render/manager/add/GlbModelConfigFormItems.vue";
import {ElMessage} from "element-plus";
import {useRenderStore} from "@/store";
import {v1 as uuid} from "uuid";
import _ from "lodash";

const renderStore = useRenderStore();
const {addModel} = renderStore;

const dialogVisible = ref(false);

const typeSelectOptions: {
  value: ModelType,
  label: string
}[] = Object.entries(MODEL_TYPE_LABEL_MAP).map(([value, label]) => ({
  value: value as ModelType, // 类型断言，将字符串值转换为 Step 枚举类型
  label: label,
}));

const configFormRef = ref();

const defaultFormModel: Model = {
  id: "",
  name: "",
  type: ModelType.GLTF,
  config: MODEL_DEFAULT_CONFIG[ModelType.GLTF]
};

const modelFormData = ref<Model>(_.cloneDeep(defaultFormModel));

const handleSelectChange = (value: ModelType) => {
  modelFormData.value.config = MODEL_DEFAULT_CONFIG[value];
};

const resetForm = () => {
  modelFormData.value = _.cloneDeep(defaultFormModel);
};

const onSubmit = () => {
  if (modelFormData.value.name === "") {
    ElMessage.warning("请输入模型名称！");
    return;
  }
  if ((modelFormData.value.config as GltfConfig).url !== undefined && (modelFormData.value.config as GltfConfig).url === "") {
    ElMessage.warning("请上传模型！");
    return;
  }
  modelFormData.value.id = uuid();
  addModel(modelFormData.value);
  resetForm();
  closeDialog();
};

const openDialog = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};

</script>

<style scoped lang="less">

</style>
