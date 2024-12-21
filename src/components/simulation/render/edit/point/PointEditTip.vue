<template>
  <div class="cesium_paint_tip_point_container">
    <div class="cesium_paint_tip_point_row_container">
      <table class="form_table" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td class="key_col">
            <MouseLeftClickIcon/>
          </td>
          <td class="val_col">确定绘制</td>
        </tr>
        <tr>
          <td class="key_col">
            <MouseRightClickIcon/>
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
.cesium_paint_tip_point_container {
  width: 150px;
  height: fit-content;
  background: rgba(255, 255, 255, 0.5);
  padding: 5px;
  border-bottom-right-radius: 5px;

  .form_table {
    width: 100%;
    border-spacing: 0px 10px;

    .key_col {
      font-size: 20px;
      vertical-align: middle;
      width: 50px;
      text-align: center;

      i {
        font-size: 30px;
      }
    }

    .val_col {
      vertical-align: middle;
      font-size: 18px;
    }
  }
}
</style>
