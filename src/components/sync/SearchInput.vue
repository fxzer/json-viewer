<script lang="ts" setup>
import { useGlobalStore } from '@/store'

const { keyword, focusCount } = toRefs(useGlobalStore())
</script>

<template>
  <div class="flex-y-center gap-2">
    <div class="h-30px flex-y-center flex-nowrap gap-1 rounded bg-white px1 lt-md:my-2 dark:bg-white/20">
      <span class="iconfont icon-search text-gray" />
      <input
        v-model.trim="keyword" class="flex-1 bg-transparent outline-none" text="gray-500 dark:gray-300" type="text"
        :placeholder="$t('inputPlaceholder')"
      >
      <Transition>
        <span
          v-show="keyword" class="iconfont icon-clear cursor-pointer text-gray/60 hover:text-gray"
          @click="keyword = ''"
        />
      </Transition>
    </div>
    <span class="text-nowrap text-primary">{{ focusCount }}</span>
  </div>
</template>
