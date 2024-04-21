<script lang="ts" setup>
import { useGlobalStore } from '@/store'

const { keyword, focusCount } = toRefs(useGlobalStore())
</script>

<template>
  <div class="flex-y-center gap-1 bg-white dark:bg-white/20 rounded px1  h-30px flex-nowrap">
    <span class="iconfont icon-search text-gray" />
    <input v-model.trim="keyword" class="flex-1 outline-none bg-transparent" text="gray-500 dark:gray-300" type="text" placeholder="请输入">
    <span v-show="focusCount" class="text-green text-nowrap ">{{ focusCount }} 个</span>
  </div>
</template>
