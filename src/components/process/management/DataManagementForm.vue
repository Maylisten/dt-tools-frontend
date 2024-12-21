<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {del, get} from "@/utils/axios.ts";
import {useProjectStore} from "@/store";
import {storeToRefs} from "pinia";
import axios from "axios";

// 文件列表数据，确保初始值为一个空数组
const files = ref([]);

// 测试数据
const testFiles = [
  {id: "1", name: "测试文件1.docx", path: "/uploads/测试文件1.docx"},
  {id: "2", name: "测试文件2.pdf", path: "/uploads/测试文件2.pdf"},
];

// 获取当前项目 ID
const projectStore = useProjectStore();
const {currentProjectId} = storeToRefs(projectStore);

// 搜索框内容
const searchQuery = ref("");

// 获取文件列表
const fetchFiles = async () => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("请求超时"));
      }, 5000);
    });

    // console.log("当前项目 ID:", currentProjectId.value);

    // 从后端获取文件列表
    const result = await Promise.race([
      get(`/management/list?projectId=${currentProjectId.value}`),
      timeoutPromise,
    ]);

    // console.log("后端返回的数据:", result);

    // 确保后端返回的结果符合预期
    if (result && result.status === "ok" && Array.isArray(result.data)) {
      files.value = result.data;
    } else {
      throw new Error("后端返回的数据格式不正确");
    }
  } catch (error) {
    console.error("获取文件列表时出错:", error);
    ElMessage.error(error.message || "获取文件列表失败");
    files.value = testFiles; // 使用测试数据
  }
};

// 下载文件
const downloadFile = async (fileId: string, fileName: string) => {
  try {
    const response = await axios.get(`/management/download`, {
      params: {projectId: currentProjectId.value, fileId},
      responseType: "blob", // 接收二进制流
    });

    // 创建 Blob 对象
    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName; // 设置下载的文件名
    link.click(); // 触发下载
    window.URL.revokeObjectURL(link.href); // 释放 URL 对象
    ElMessage.success("文件下载成功！");
  } catch (error) {
    console.error("文件下载失败:", error);
    ElMessage.error("文件下载失败，请稍后重试！");
  }
};

// 删除文件
const deleteFile = async (fileId: string, fileName: string) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
        `您确定要删除文件吗？此操作不可撤销。`,
        "确认删除",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
    );

    // 确认后执行删除操作
    const response = await del(`/management/delete`, {
      projectId: currentProjectId.value,
      fileId,
    });
    ElMessage.success("文件删除成功！");
    fetchFiles(); // 刷新文件列表
  } catch (error) {
    if (error === "cancel") {
      // 用户取消删除
      ElMessage.info("删除操作已取消");
    } else {
      // 处理删除失败的情况
      console.error("文件删除失败:", error);
      ElMessage.error("文件删除失败，请稍后重试！");
    }
  }
};

// 过滤文件列表
const filteredFiles = computed(() => {
  // 如果搜索框内容为空，返回所有文件
  if (!searchQuery.value.trim()) {
    return files.value;
  }

  // 如果搜索框有内容，按名称过滤文件
  return Array.isArray(files.value)
      ? files.value.filter((file) =>
          file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
      : [];
});

// 初始化
onMounted(() => {
  fetchFiles();
});
</script>

<template>
  <div>
    <!-- 搜索框 -->
    <el-input
        v-model="searchQuery"
        placeholder="搜索文件"
        clearable
        style="margin-bottom: 20px; width: 300px;"
    />

    <!-- 文件列表表格 -->
    <el-table
        :data="filteredFiles"
        border
        style="width: 100%"
    >
      <!-- 文件名 -->
      <el-table-column prop="name" label="文件名" align="center"/>

      <!-- 操作按钮 -->
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <!-- 下载按钮 -->
          <el-button
              type="primary"
              size="small"
              @click="downloadFile(row.path, row.name)"
          >
            下载
          </el-button>
          <!-- 删除按钮 -->
          <el-button
              type="danger"
              size="small"
              @click="deleteFile(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="less">
</style>
