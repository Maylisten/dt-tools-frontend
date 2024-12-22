<template>
  <div
      class="w-80 h-56 bg-white border-gray-300 border-2 rounded hover:cursor-pointer hover:scale-105 transition-transform flex flex-row justify-center items-center text-2xl"
      @click="handleGo"
      @contextmenu="onContextMenu($event)"
  >
    {{ props.name }}
  </div>
  <ContextMenu
      v-model:show="contextMenuShow"
      :options="optionsComponent"
  >
    <context-menu-item label="进入" @click="handleGo">
      <template #icon>
        <DoorIcon class="text-xl"/>
      </template>
    </context-menu-item>
    <context-menu-item label="删除" @click="confirmDialogVisible = true">
      <template #icon>
        <DeleteIcon class="text-xl"/>
      </template>
    </context-menu-item>
  </ContextMenu>

  <el-dialog
      v-model="confirmDialogVisible"
      title="警告"
      width="300"
  >
    <span>确定删除场景 『{{ name }}』 以及场景下的全部数据吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="handleRemove">
          删除
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import {ContextMenu, ContextMenuItem, type MenuOptions} from '@imengyu/vue3-context-menu';
import {ref} from "vue";
import DeleteIcon from "@/components/icons/DeleteIcon.vue";
import DoorIcon from "@/components/icons/DoorIcon.vue";

const emit = defineEmits(['go', 'remove']);

type Props = {
  id: string,
  name: string
}
const props = withDefaults(defineProps<Props>(), {
  id: "",
  name: ""
});

const handleGo = () => {
  emit('go', props.id);
};

const confirmDialogVisible = ref(false);
const handleRemove = () => {
  emit('remove', props.id);
};

const optionsComponent = ref<MenuOptions>({
  iconFontClass: 'iconfont',
  customClass: "class-a",
  zIndex: 3,
  minWidth: 230,
  x: 500,
  y: 200
});
const contextMenuShow = ref<boolean>(false);
const onContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  optionsComponent.value.x = e.x;
  optionsComponent.value.y = e.y;
  contextMenuShow.value = true;
};

</script>

<style scoped lang="less">

</style>
