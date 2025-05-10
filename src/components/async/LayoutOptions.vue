<script lang="ts" setup>
const activeLayout = defineModel()
const typeList = [
  {
    type: 'mindmap',
    image:
      'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*wRZjTL3fCbEAAAAAAAAAAABkARQnAQ',
  },
  {
    type: 'compact-box',
    image:
      'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*XlXOR5pmM3oAAAAAAAAAAABkARQnAQ',
  },
  {
    type: 'indented',
    image:
      'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*kbzRRZk2t2cAAAAAAAAAAABkARQnAQ',
  },
  {
    type: 'dendrogram',
    image:
      'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*ffD6S74MXw4AAAAAAAAAAABkARQnAQ',
  },
]
</script>

<template>
  <div class="grid grid-cols-4 mb-5 gap-5">
    <div
      v-for="(ltype, index) in typeList" :key="index" class="cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-1"
      :class="{ selected: ltype.type === activeLayout }" @click="activeLayout = ltype.type"
    >
      <img :src="ltype.image" class="h-14 border rounded" :class="ltype.type === activeLayout ? '!border-primary' : ''">
      <p class="mt-2 text-center text-xs" :class="ltype.type === activeLayout ? 'text-primary' : ''">
        {{ $t(ltype.type) }}
      </p>
    </div>
  </div>
</template>
