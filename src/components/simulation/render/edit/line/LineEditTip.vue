<template>
  <div class="cesium_paint_tip_line_container">
    <div class="cesium_paint_tip_line_row_container">
      <table class="form_table" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td class="key_col">
            <div class="key_col_content">
              <MouseLeftClickIcon/>
            </div>
          </td>
          <td class="val_col">添加拐点</td>
        </tr>
        <tr>
          <td class="key_col">
            <div class="key_col_content">
              <MouseRightClickIcon/>
            </div>
          </td>
          <td class="val_col">删除拐点</td>
        </tr>
        <tr>
          <td class="key_col">
            <div class="key_col_content">
              <span>SHIFT</span>
              <div style="margin: 5px; font-size: 20px;">+</div>
              <MouseRightClickIcon/>
            </div>
          </td>
          <td class="val_col">确定绘制</td>
        </tr>
        <tr>
          <td class="key_col">
            <div class="key_col_content">
              Ctrl
              <div style="margin: 5px; font-size: 20px;">+</div>
              <MouseRightClickIcon/>
            </div>
          </td>
          <td class="val_col">取消绘制</td>
        </tr>
      </table>
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

  .form_table {
    width: 100%;
    border-spacing: 0 10px;

    .key_col {
      vertical-align: middle;
      text-align: left;

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
      vertical-align: middle;
      font-size: 18px;
    }
  }
}
</style>
