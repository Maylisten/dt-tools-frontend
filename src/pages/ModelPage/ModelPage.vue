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

      <el-row :gutter="20" class="button-row">
        <el-col :span="12">
          <el-button type="primary" @click="tojson" class="action-button">保存页面</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="danger" @click="deleteCurrentNode" class="action-button">删除当前结点</el-button>
        </el-col>
      </el-row>

      <el-button type="primary" @click="changeLabel" class="action-button">修改label值</el-button>

    </div>
  </div>

  <el-dialog
      v-model="showEdgeDialog"
      title="更新边标签"
      :before-close="closeEdgeDialog"
  >
    <el-input v-model="edgeLabel" placeholder="请输入新的标签"/>
    <template #footer>
      <el-button @click="closeEdgeDialog">取消</el-button>
      <el-button type="primary" @click="updateEdgeLabel">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog
      v-model="showDialog"
      title="请输入节点 Label"
      width="30%"
      :close-on-click-modal="false"
  >
    <el-input
        v-model="nodeLabel"
        placeholder="请输入节点的 Label"
    ></el-input>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-dialog>

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

// 边的相关数据
const showEdgeDialog = ref(false); // 控制对话框显示
const edgeLabel = ref(''); // 保存用户输入的标签
let currentEdge = ref(); // 当前点击的边

function deleteCurrentNode() {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.removeCells(cells);
  }
  tojson();

}

function changeLabel() {
  const cells = graph.getSelectedCells();
  console.log(cells);
  if (cells.length) {
    cells.forEach((cell) => {
      if (cell.isNode()) {
        // 如果是节点，则修改其 Label
        const newLabel = prompt("请输入新的 Label:", cell.attr("text/text")); // 弹窗输入新的 Label
        if (newLabel) {
          cell.attr("text/text", newLabel); // 设置新的 Label
        }
      }
    });
  }

  tojson();

}

function openEdgeDialog(edge) {
  currentEdge.value = edge; // 保存当前边
  console.log(currentEdge.value.getLabels());
  let labels = currentEdge.value.getLabels();
  edgeLabel.value = labels[0]?.attrs?.text?.text || labels[0]?.attrs?.label?.text || ''; // 预填充当前标签// 预填充当前标签
  showEdgeDialog.value = true; // 显示对话框
}

// 关闭对话框
function closeEdgeDialog() {
  showEdgeDialog.value = false;
  currentEdge.value = null; // 清空当前边
}

// 更新边的标签
function updateEdgeLabel() {
  if (currentEdge && edgeLabel.value) {
    currentEdge.value.setLabelAt(
        0, edgeLabel.value
    ); // 更新标签
    closeEdgeDialog(); // 关闭对话框
    tojson();
  }
}

// 控制对话框显示
const showDialog = ref(false);
// 用户输入的 Label 值
const nodeLabel = ref("");
// 用于 Promise 的 resolve
let resolvePromise: (value: string | null) => void;

// 弹出对话框，获取用户输入
function getLabelFromUser(): Promise<string | null> {
  return new Promise((resolve) => {
    resolvePromise = resolve; // 将 resolve 存储起来，用于 confirm 和 cancel 时调用
    showDialog.value = true; // 显示对话框
  });
}

// 用户点击确认
function confirm() {
  resolvePromise(nodeLabel.value); // 返回用户输入的值
  resetDialog();
}

// 用户点击取消
function cancel() {
  resolvePromise(null); // 返回 null 表示用户取消操作
  resetDialog();
}

// 重置对话框
function resetDialog() {
  showDialog.value = false; // 隐藏对话框
  nodeLabel.value = ""; // 清空输入框内容
}

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

  graph.on('node:added', async ({node}) => {
    const label = await getLabelFromUser();
    if (label) {
      node.attr('text/text', label); // 设置用户输入的 label
    }
  });

  graph.on('edge:click', ({edge}) => {
    // edge.attr('line/stroke', '#FF0000'); // 高亮边的颜色
    openEdgeDialog(edge);
    // const newLabel = prompt('请输入新的标签内容:', 'Updated Label');
    // if (newLabel) {
    //     edge.attr('label/text', newLabel);
    //     // edge.attr('line/stroke', '#A2B1C3'); // 恢复默认颜色
    // }
  });

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
