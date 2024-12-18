<template>
  <div>Home</div>
</template>

<script setup lang="ts">
import {$axios} from "@/utils/axios.ts";

$axios.get("/test/test");

</script>

<style scoped lang="less"></style>
