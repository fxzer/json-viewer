<template>
  <div class="layout-options">
    <div class="layout-item" 
    v-for="(ltype, index) in typeList" :key="index"
    :class="{'selected': ltype.type === type }"
    @click="onTypeSelect(ltype)"
    >
      <img :src="ltype.image" alt="" />
      <p class="type-name">{{ ltype.name }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import  useStore  from '@/store/index';
import { toRefs, watch } from 'vue';
import { TypeOption } from '@/types/layout/option'
const { layout } = useStore();
const { type } = toRefs(layout);
const typeList: Array<TypeOption>  = [
  {
    type: "indented",
    name: "缩进树",
    image:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*kbzRRZk2t2cAAAAAAAAAAABkARQnAQ",
  },
  {
    type: "mindmap",
    name: "脑图树",
    image:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*wRZjTL3fCbEAAAAAAAAAAABkARQnAQ",
  },
  {
    type: "compactBox",
    name: "紧凑树",
    image:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*XlXOR5pmM3oAAAAAAAAAAABkARQnAQ",
  },
  {
    type: "dendrogram",
    name: "生态树",
    image:
      "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*ffD6S74MXw4AAAAAAAAAAABkARQnAQ",
  },
];
const onTypeSelect = (ltype) => {
   layout.setType(ltype.type) 
};
watch(() => layout.type ,(val) => console.log(val))
</script>
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
      img{
        box-shadow: 0 6px 16px rgba(107, 147, 224, 0.14);
      }
      .type-name {
        color: #444;
      }
    }
    &.selected {  
      img{
        border-color: #a278dc;
      }
      .type-name {
        color: #a278dc;
      }
    }
    img {
      width: 100%;
      border: 1px solid #f0f0f0;
     border-radius: 3px;
      height: calc(100% - 20px);
    }
    .type-name {
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
