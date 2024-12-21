<template>
  <div id="main-container">
    <div id="stencil-container"></div>
    <div id="graph-container"></div>

    <!-- 面板弹出层 -->
    <div v-if="showPanel" id="input-container" class="panel-container">
      <!-- 面板标题 -->
      <el-text class="mx-1 panel-title">
        <el-icon>
          <EditPen/>
        </el-icon>
        输入数据
      </el-text>

      <!-- 键值对输入框 -->
      <el-row :gutter="20" class="input-row">
        <el-col :span="12">
          <el-input
              v-model="newKey"
              class="input-box"
              placeholder="请输入键"
          />
        </el-col>
        <el-col :span="12">
          <el-input
              v-model="newValue"
              class="input-box"
              placeholder="请输入值"
          />
        </el-col>
      </el-row>

      <!-- 添加按钮 -->
      <el-button type="primary" @click="addKeyValue" class="add-button">添加键值对</el-button>

      <!-- 键值对展示 -->
      <div v-if="Object.keys(currentNodeData).length > 0" class="table-container">
        <el-table :data="formattedNodeData" style="width: 100%">
          <el-table-column prop="key" label="键" width="180"/>
          <el-table-column prop="value" label="值"/>

          <!-- 删除按钮 -->
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button
                  type="danger"
                  size="small"
                  @click="deleteKeyValue(row.key)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 操作按钮 -->
      <el-row :gutter="20" class="button-row">
        <el-col :span="12">
          <el-button type="danger" @click="closePanel" class="action-button">关闭面板</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="danger" @click="clearGraph" class="action-button">清空graph...</el-button>
        </el-col>
      </el-row>

      <el-button type="primary" @click="tojson" class="action-button">保存页面</el-button>

    </div>
  </div>

</template>
<!-- 左边边栏设置按钮，点击以后获取画布，在画布里面添加节点内容,然后可以互相连线，导出 -->
<script setup lang="ts">

import {computed, onMounted, reactive, ref} from 'vue';
import {graph, initGraph} from './graph.ts';
import {Node} from '@antv/x6';
import {EditPen} from '@element-plus/icons-vue';
import {post} from '@/utils/axios.ts';
import {useProjectStore} from "@/store";
import {storeToRefs} from "pinia";

// 响应式数据
const showPanel = ref(false); // 控制面板显示
const newKey = ref(''); // 键输入框
const newValue = ref(''); // 值输入框
// const nodeData = reactive<Record<string, string>>({}); // 保存节点的键值对数据
let currentNode = ref<Node | null>(null);
const currentNodeData = reactive<Record<string, string>>({});

const formattedNodeData = computed(() => {
  return Object.entries(currentNodeData).map(([key, value]) => ({key, value}));
});

//挂载后执行
onMounted(() => {
  initGraph(); // 初始化图形并渲染到页面中
  setupGraphEvents();
});

function deleteKeyValue(key: string) {
  delete currentNodeData[key]; // 删除指定键的键值对
  // const tempData = { ...currentNodeData };

  // Object.keys(currentNodeData).forEach(key => {
  //   delete currentNodeData[key];
  // });

  // Object.keys(tempData).forEach(key => {
  //   currentNodeData[key] = tempData[key];
  // });

  // console.log(currentNode.value);
  Object.keys(currentNode.value!.data).forEach(key => {
    delete currentNode.value!.data[key];
  });
  currentNode.value!.setData(currentNodeData);
  tojson();
}

// 设置图形相关事件
function setupGraphEvents() {

  // 监听节点点击事件
  graph.on('node:click', ({node}) => {
    currentNode.value = node;

    if (currentNode.value.data) {
      reset();
      for (const [key, value] of Object.entries(currentNode.value.data)) {
        currentNodeData[key] = value;
      }
      // console.log(currentNode.value.data);
    } else {
      reset();
    }
    showPanel.value = true; // 显示面板
  });

}

function reset() {
  Object.keys(currentNodeData).forEach(key => {
    delete currentNodeData[key];
  });
}

// 添加键值对
function addKeyValue() {
  if (newKey.value && newValue.value != null) {
    currentNodeData[newKey.value] = newValue.value;
    newKey.value = ''; // 清空键输入框
    newValue.value = ''; // 清空值输入框
  }
  saveData();
  tojson();
}

// 保存数据到节点
function saveData() {

  currentNode.value!.data = {...currentNodeData}; // 将键值对数据保存到节点

  Object.entries(currentNodeData).forEach(([key, value]) => {
    // if(key === "")
    // console.log(currentNode.value!);
    if (key === currentNode.value!.getAttrs().text.text) {
      currentNode.value!.attr("label/text", value);
    }
  });

  // closePanel();
}

function tojson() {
  // 1. 获取图形的 JSON 数据
  const graphData = graph.toJSON();

  const projectStore = useProjectStore();
  const {currentProjectId} = storeToRefs(projectStore);

  post('/diagram/save-graph', {
    'projectId': currentProjectId.value as string,
    'graphData': graphData
  });

}

function clearGraph() {
  // 获取图形中的所有节点和边
  const cells = graph.getCells();
  // 删除所有节点和边
  graph.removeCells(cells);
  tojson();

}

// 关闭面板
function closePanel() {
  showPanel.value = false;
}

</script>

<style scoped>

#main-container {
  display: flex;
  height: 100vh;
  position: relative;
  border: 1px solid #dfe3e8;
}

#stencil-container {
  width: 300px;
  height: 100%;
  margin-right: auto;
  /* position: relative; */
  border-right: 1px solid #dfe3e8;
}

#graph-container {
  width: calc(100% - 180px);
  height: 100%;
  position: relative;
}

#input-container {
  width: 500px;
  height: 100%;
  position: relative;
}

.mx-1 {
  font-size: medium;
}

.x6-widget-stencil {
  background-color: #fff;
}

.x6-widget-stencil-title {
  background-color: #fff;
}

.x6-widget-stencil-group-title {
  background-color: #fff !important;
}

.x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0px;
  border: 1px solid #239edd;
}

.x6-widget-transform > div {
  border: 1px solid #239edd;
}

.x6-widget-transform > div:hover {
  background-color: #3dafe4;
}

.x6-widget-transform-active-handle {
  background-color: #3dafe4;
}

.x6-widget-transform-resize {
  border-radius: 0;
}

.x6-widget-selection-inner {
  border: 1px solid #239edd;
}

.x6-widget-selection-box {
  opacity: 0;
}

/* 面板容器 */
.panel-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  /* margin: 20px auto; */
}

/* 面板标题 */
.panel-title {
  font-size: 18px;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.panel-title el-icon {
  margin-right: 8px;
}

/* 输入框行 */
.input-row {
  margin-top: 20px;
}

/* 输入框 */
.input-box {
  width: 100%;
}

/* 添加按钮 */
.add-button {
  margin-top: 20px;
  width: 100%;
}

/* 键值对表格容器 */
.table-container {
  margin-top: 20px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 操作按钮行 */
.button-row {
  margin-top: 20px;
}

/* 操作按钮 */
.action-button {
  width: 100%;
  font-size: 14px;
  padding: 10px 0;
  border-radius: 4px;
}

.action-button:first-of-type {
  margin-bottom: 10px;
}

</style>
