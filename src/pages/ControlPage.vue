<template>
  <div>
    <div>社会治理事件调控</div>
    <el-tabs type="border-card">
      <el-tab-pane label="视频处理">
        模型1
        <el-upload
            class="upload-demo"
            :file-list="fileList"
            :show-file-list="false"
            drag
            action="#"
            :on-change="handleUploadChange"
            :accept="'.mp4,.avi,.mov,.wmv'"
        >
          <template #default>
            <div v-if="previewUrl" class="video-preview">
              <video controls :src="previewUrl" style="width: 300px; height: 200px;"></video>
            </div>
            <div v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
              <div class="el-upload__tip">
                Please upload video files
              </div>
            </div>
          </template>
        </el-upload>
        <el-button type="primary" @click="startProcess">提交</el-button>
        <div v-if="submittedVideoUrl" class="submitted-video">
          <h3>视频结果:</h3>
          <video controls :src="submittedVideoUrl" style="width: 600px; height: 400px;"></video>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图片处理">
        模型2
        <el-upload
            class="upload-demo"
            :file-list="fileList"
            :show-file-list="false"
            drag
            action="#"
            :on-change="handleUploadChange"
            :accept="'.jpg,.png'"
        >
          <template #default>
            <div v-if="previewUrl" class="image-preview">
              <img :src="previewUrl" alt="Preview" style="max-width: 300px; max-height: 200px;">
            </div>
            <div v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
              <div class="el-upload__tip">
                Please upload image files
              </div>
            </div>
          </template>
        </el-upload>
        <el-button type="primary" @click="startProcessImage">提交</el-button>
        <div v-if="submittedImageUrl" class="submitted-image">
          <h3>图片结果:</h3>
          <img :src="submittedImageUrl" alt="Result" style="width: 600px; height: 400px;">
        </div>

      </el-tab-pane>
      <el-tab-pane label="文件处理">
        模型3
        <div>
          <el-upload
              class="upload-demo"
              :file-list="fileList"
              :show-file-list="false"
              drag
              action="#"
              :on-change="handleWordUploadChange"
              :accept="'.docx'"

          >
            <template #default>
              <div v-if="previewIcon" class="image-preview">
                <img :src="previewIcon" alt="Preview" style="max-width: 300px; max-height: 200px;">
              </div>
              <div v-else>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
                <div class="el-upload__tip">
                  Please upload Word documents
                </div>
              </div>
            </template>
          </el-upload>
          <el-button type="primary" @click="submitDocument">提交</el-button>
          <div v-if="outputVisible" class="output-box">
            {{ outputText }}
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import {ElButton, ElLoading, ElTabPane, ElTabs, ElUpload} from 'element-plus';
import {nextTick, ref} from 'vue';
import type {LoadingInstance} from 'element-plus/lib/components/loading/src/loading.d';

const videoPath = '/public/违停录屏.mp4';

const outputImage1 = '/public/images/outputimage0.jpg';
const outputImage2 = '/public/images/outputimage1.jpg';
const outputImage3 = '/public/images/outputimage2.jpg';
const wordPreviewIcon = '/public/icon.png'; // 使用import引入图片

const fileList = ref([]);
const previewUrl = ref(null);
const submittedVideoUrl = ref(null);
const submittedImageUrl = ref(null);
const inputImageName = ref(''); // 用于绑定输入框输入的值

let loadingInstance: LoadingInstance | null = null;

const handleUploadChange = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
  };
  reader.readAsDataURL(file.raw);
  inputImageName.value = file.name;
};

const startProcess = async () => {
  // 显示加载条
  loadingInstance = ElLoading.service({
    lock: true,
    text: '正在加载，请稍候...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const delay = Math.floor(Math.random() * (10 - 5 + 1) + 5) * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // 使用导入的视频路径设置提交后的视频URL
  submittedVideoUrl.value = videoPath;
  // 等待DOM更新后（确保视频相关元素已准备好），关闭加载条
  await nextTick();
  if (loadingInstance) {
    loadingInstance.close();
  }
};

const startProcessImage = async () => {
  try {
    console.log('inputImageName:', inputImageName);
    loadingInstance = ElLoading.service({
      lock: true,
      text: '正在加载，请稍候...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    const delay = Math.floor(Math.random() * (10 - 5 + 1) + 5) * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
    console.log("===================================================");
    const inputImageNameValue = inputImageName.value;

    let outputImagePath;
    switch (inputImageNameValue) {
      case 'inputimage0.jpg':
        outputImagePath = outputImage1;
        break;
      case 'inputimage1.jpg':
        outputImagePath = outputImage2;
        break;
      case 'inputimage2.jpg':
        outputImagePath = outputImage3;
        break;
      default:
        console.error('输入的图片名称不匹配，请重新输入');
        return;
    }
    console.log(outputImagePath);
    // 设置提交后的图片路径为根据输入名称选择的对应图片路径
    if (outputImagePath) {
      submittedImageUrl.value = outputImagePath;
    }
  } catch (error) {
    console.error('startProcessImage方法执行出现异常:', error);
  } finally {
    // 等待DOM更新后（确保图片相关元素已准备好），关闭加载条
    await nextTick();
    if (loadingInstance) {
      loadingInstance.close();
    }
  }
};

const previewIcon = ref(null); // 用于存储预览图的URL
let uploadedFile = null;
let outputText = ref(''); // 用于绑定输出框显示的文本
let outputVisible = ref(false); // 用于控制输出框的显示与隐藏

const handleWordUploadChange = (file, fileListValue) => {
  fileList.value = fileListValue;
  // 假设只允许上传一个文件
  uploadedFile = file ? file.raw : null;
  if (file.raw) {
    // 假设所有Word文档的预览图都使用同一个图片
    previewIcon.value = wordPreviewIcon; // 使用import引入的图片
    fileList.value = [...fileList.value, file];
  }
};

const submitDocument = async () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: '正在加载，请稍候...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const delay = Math.floor(Math.random() * (10 - 5 + 1) + 5) * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  outputText.value = '文档处理完成,核心内容如下：\n' +
      '\n' +
      '- **标题**：静夜思\n' +
      '- **作者**：李白（唐代）\n' +
      '- **内容**：\n' +
      '  - 床前明月光，疑是地上霜。\n' +
      '  - 举头望明月，低头思故乡。\n' +
      '《静夜思》这首诗表达了诗人李白深沉的思乡之情。通过描绘一个宁静的夜晚，月光洒在床前如同秋霜一般，诗人抬头仰望天空中的明月，内心涌起对远方故乡的无限思念。诗中的“举头望明月，低头思故乡”尤为直接地表达了这种情感，显示了李白在异乡对家乡的深切怀念和孤独感。整首诗通过对夜晚月光的描写，传达了一种寂寞、清冷而又温馨的情感氛围。\n';
  outputVisible.value = true;
  await nextTick();
  if (loadingInstance) {
    loadingInstance.close();
  }
};
</script>

