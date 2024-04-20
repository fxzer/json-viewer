<script lang="ts" setup>
import { useSearchStore } from '@/store'

const { keyword, focusCount } = toRefs(useSearchStore())
</script>

<template>
  <div class="flex-y-center gap-1 bg-white rounded px1  h-30px flex-nowrap">
    <span class="iconfont icon-search" />
    <input v-model.trim="keyword" class="search-input flex-1 outline-none  " type="text" placeholder="请输入">
    <span v-show="focusCount" class="text-green text-nowrap ">{{ focusCount }} 个</span>
  </div>
</template>
