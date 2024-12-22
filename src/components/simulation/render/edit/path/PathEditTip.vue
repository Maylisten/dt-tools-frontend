<template>
  <div class="cesium_paint_tip_line_container">
    <div class="cesium_paint_tip_line_row_container">
      <div class="form_grid">
        <div class="key_col">
          <div class="key_col_content">
            <MouseLeftClickIcon/>
          </div>
        </div>
        <div class="val_col">添加拐点</div>

        <div class="key_col">
          <div class="key_col_content">
            <MouseRightClickIcon/>
          </div>
        </div>
        <div class="val_col">删除拐点</div>

        <div class="key_col">
          <div class="key_col_content">
            <span>SHIFT</span>
            <div style="margin: 5px; font-size: 20px;">+</div>
            <MouseRightClickIcon/>
          </div>
        </div>
        <div class="val_col">确定绘制</div>

        <div class="key_col">
          <div class="key_col_content">
            Ctrl
            <div style="margin: 5px; font-size: 20px;">+</div>
            <MouseRightClickIcon/>
          </div>
        </div>
        <div class="val_col">取消绘制</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MouseLeftClickIcon from "@/components/icons/MouseLeftClickIcon.vue";
import MouseRightClickIcon from "@/components/icons/MouseRightClickIcon.vue";
</script>

<style lang="less" scoped>
.cesium_paint_tip_line_container {
  width: fit-content;
  height: fit-content;
  background: rgba(255, 255, 255, 0.5);
  padding: 5px;
  border-bottom-right-radius: 5px;

  .form_grid {
    display: grid;
    grid-template-columns: 100px 1fr; /* 50px for the icon column, 1fr for the value column */
    grid-gap: 10px;
    align-items: center;
  }

  .key_col {
    display: flex;
    justify-content: start;
    align-items: center;

    .key_col_content {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: fit-content;
      height: fit-content;

      i {
        font-size: 30px;
      }
    }
  }

  .val_col {
    font-size: 18px;
  }
}
</style>
