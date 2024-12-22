<template>
  <el-button type="primary" size="small" @click="handleExportClick">
    <ExportIcon class="text-base"/>
  </el-button>
</template>

<script setup lang="ts">

import ExportIcon from "@/components/icons/ExportIcon.vue";
import {saveAs} from 'file-saver';
import {Area, Line, Path, Point} from "@/types/SimulationEntities.ts";
import {useSimulationStore} from "@/store";
import {storeToRefs} from "pinia";

const simulationStore = useSimulationStore();
const {points, lines, areas, paths} = storeToRefs(simulationStore);

function exportToCzml(points: Point[], lines: Line[], areas: Area[], paths: Path[]): string {
  const czml: any[] = [];

  // 添加文档头
  czml.push({
    id: "document",
    version: "1.0",
    clock: {
      interval: getGlobalAvailability(points, lines, areas, paths),
      currentTime: new Date().toISOString(),
      multiplier: 1,
      range: "LOOP_STOP",
    },
  });

  // 添加点
  points.forEach(point => {
    czml.push({
      id: point.id,
      name: point.label,
      availability: formatAvailability(point.availability),
      position: {
        cartesian: point.position,
      },
      point: {
        color: hexToRgbaColor(point.color),
        pixelSize: 10,
      },
    });
  });

  // 添加线
  lines.forEach(line => {
    czml.push({
      id: line.id,
      name: line.label,
      availability: formatAvailability(line.availability),
      polyline: {
        positions: {
          cartesian: line.positions.flat(),
        },
        material: {
          solidColor: {
            color: hexToRgbaColor(line.color),
          },
        },
        width: 3,
      },
    });
  });

  // 添加面
  areas.forEach(area => {
    czml.push({
      id: area.id,
      name: area.label,
      availability: formatAvailability(area.availability),
      polygon: {
        hierarchy: {
          cartesian: area.positions.flat(),
        },
        material: {
          solidColor: {
            color: hexToRgbaColor(area.color),
          },
        },
      },
    });
  });

  // 添加路径
  paths.forEach(path => {
    czml.push({
      id: path.id,
      name: path.label,
      availability: formatAvailability(path.availability),
      position: {
        epoch: path.points[0]?.time.toISOString(),
        cartesian: path.points.flatMap(point => [
          (new Date(point.time).getTime() - new Date(path.points[0].time).getTime()) / 1000, // 时间偏移
          ...point.position,
        ]),
      },
      path: {
        material: {
          solidColor: {
            color: {
              rgba: [255, 255, 255, 255], // 白色路径
            },
          },
        },
        width: 5,
        leadTime: 10,
        trailTime: 10,
      },
    });
  });

  return JSON.stringify(czml, null, 2);
}

// 辅助函数：格式化 availability
function formatAvailability(availability: [Date, Date]): string {
  return `${availability[0].toISOString()}/${availability[1].toISOString()}`;
}

// 辅助函数：转换颜色
function hexToRgbaColor(hex: string): { rgba: number[] } {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return {rgba: [r, g, b, 255]}; // 假设不透明
}

// 辅助函数：获取全局 availability
function getGlobalAvailability(
    points: Point[],
    lines: Line[],
    areas: Area[],
    paths: Path[]
) {
  const allTimes = [
    ...points.map(p => p.availability),
    ...lines.map(l => l.availability),
    ...areas.map(a => a.availability),
    ...paths.map(p => p.availability),
  ];
  const minTime = new Date(Math.min(...allTimes.map(a => a[0].getTime())));
  const maxTime = new Date(Math.max(...allTimes.map(a => a[1].getTime())));
  return `${minTime.toISOString()}/${maxTime.toISOString()}`;
}

function saveCzml(points: Point[], lines: Line[], areas: Area[], paths: Path[]): void {
  const czmlContent = exportToCzml(points, lines, areas, paths);
  const blob = new Blob([czmlContent], {type: "application/json"});
  saveAs(blob, "scene.czml");
}

const handleExportClick = () => {
  saveCzml(points.value, lines.value, areas.value, paths.value);
};
</script>

<style scoped lang="less">

</style>
