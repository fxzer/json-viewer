<template>
  <div class="search-wrap">
    <input
      class="search-input"
      type="text"
      placeholder="请输入节点名称"
      v-model="props.modelValue"
      @input="onSearch"
    />
    <span class="iconfont icon-search"></span>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from "@/store";
const { currentTheme } = useThemeStore();
const props = defineProps({
  modelValue: {
    type: String,
    default: () => ({}),
  },
});
const emit = defineEmits({
  "update:modelValue": (val) => true,
});
const onSearch = (e) => {
  emit("update:modelValue", e.target.value);
};
</script>
<style scoped lang="scss">
.search-wrap {
  display: flex;
  align-items: center;
  width: 180px;
  height: 30px;
  position: absolute;
  right: 20px;
  top: 5px;
  .search-input {
    display: inline-block;
    height: 100%;
    width: 100%;
    outline: none;
    padding: 2px 6px;
    padding-right: 26px;
    background-color: v-bind("currentTheme.hbcolor");
    border-radius: 4px;
    border: none;
    color: v-bind("currentTheme.color");
    &::placeholder {
      color: v-bind("currentTheme.color");
      opacity: 0.6;
    }
  }
  .icon-search {
    position: absolute;
    right: 8px;
    color: v-bind("currentTheme.hcolor");
    opacity: 0.8;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      transform: scale(1.1);
      opacity: 1;
    }
  }
}
</style>
