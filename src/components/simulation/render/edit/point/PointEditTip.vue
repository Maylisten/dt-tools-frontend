<template>
  <div class="cesium_paint_tip_point_container">
    <div class="cesium_paint_tip_point_row_container">
      <div class="form_grid">
        <div class="key_col">
          <MouseLeftClickIcon/>
        </div>
        <div class="val_col">确定绘制</div>
        <div class="key_col">
          <MouseRightClickIcon/>
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
.cesium_paint_tip_point_container {
  width: 150px;
  height: fit-content;
  background: rgba(255, 255, 255, 0.5);
  padding: 5px;
  border-bottom-right-radius: 5px;

  .form_grid {
    display: grid;
    grid-template-columns: 50px 1fr; /* 50px for the icon column, 1fr for the value column */
    grid-gap: 10px;
    align-items: center;
  }

  .key_col {
    font-size: 20px;
    text-align: center;

    i {
      font-size: 30px;
    }
  }

  .val_col {
    font-size: 18px;
  }
}
</style>
