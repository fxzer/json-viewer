<script setup lang='ts'>
import { useThemeStore } from '@/store'
const { colors, colorName } = toRefs(useThemeStore())
</script>

<template>
  <el-popover trigger="click">
    <template #reference>
      <slot name="icon"></slot>
    </template>
    <div class='grid  grid-cols-5 justify-items-center gap-1'>
      <div class='wh-5 flex-center  rounded-sm cursor-pointer' v-for="(color, name) in colors"
        :class="{ 'bg-gray/20': name === colorName }" @click="colorName = name" :title="name">
        <span class='wh-3 rounded-full ' :style="{ backgroundColor: color }"></span>
      </div>
    </div>
  </el-popover>
</template>

<style scoped lang='scss'></style>
