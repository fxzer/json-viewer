<script lang="ts" setup>
import type {TypeOptionType, TypeOption } from '@/types/global'

const activeLayout = defineModel<TypeOptionType>()
const typeList: Array<TypeOption> = [
  {
    type: 'indented',
    name: '缩进树',
    image:
      'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*kbzRRZk2t2cAAAAAAAAAAABkARQnAQ',
  },
  {
    type: 'mindmap',
    name: '脑图树',
    image:
      'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*wRZjTL3fCbEAAAAAAAAAAABkARQnAQ',
  },
  {
    type: 'compactBox',
    name: '紧凑树',
    image:
      'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*XlXOR5pmM3oAAAAAAAAAAABkARQnAQ',
  },
  {
    type: 'dendrogram',
    name: '生态树',
    image:
      'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*ffD6S74MXw4AAAAAAAAAAABkARQnAQ',
  },
]

</script>

<template>
  <div class="layout-options">
    <div
      v-for="(ltype, index) in typeList"
      :key="index"
      class="layout-item"
      :class="{ selected: ltype.type === activeLayout }"
      @click="activeLayout = ltype.type"
    >
      <img :src="ltype.image" alt="">
      <p class="type-name">
        {{ ltype.name }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: -18px;
  margin-bottom: 20px;
  .layout-item {
    flex: 1;
    height: 80px;
    align-items: center;
    cursor: pointer;
    margin-right: 10px;
    transition: all 0.3s ease-in-out;
    //第四个去除右边距

    &:nth-child(4n) {
      margin-right: 0;
    }
    &:hover {
      transform: translateY(-2px);
      img {
        box-shadow: 0 0px 10px #9ca3af71    
      
  }
      .type-name {
        font-weight: 600;
      }
    }
    &.selected {
      img {
  
      // border: 1px solid v-bind("currentTheme.hcolor");

      }
      .type-name {
        // color: v-bind("currentTheme.hcolor");
      }
    }
    img {
      width: 100%;
      border-radius: 3px;
      height: calc(100% - 20px);
      border: 1px solid #d1d5db8f;

    }
    .type-name {
      text-align: center;
      font-size: 12px;
    }
  }
}
</style>
