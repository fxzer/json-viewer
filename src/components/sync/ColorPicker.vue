<script setup lang='ts'>
import { THEME_COLORS } from '@/constants'
import { useGlobalStore } from '@/store'

const { colorName } = toRefs(useGlobalStore())
</script>

<template>
  <el-popover trigger="click">
    <template #reference>
      <slot name="icon" />
    </template>
    <div class="grid grid-cols-5 justify-items-center gap-1">
      <div
        v-for="(color, name) in THEME_COLORS" :key="name" class="wh-5 flex-center cursor-pointer rounded-sm"
        :class="{ 'bg-gray/20': name === colorName }" :title="name" @click="colorName = name"
      >
        <span class="wh-3 rounded-full" :style="{ backgroundColor: color }" />
      </div>
    </div>
  </el-popover>
</template>

<style scoped lang='scss'></style>
