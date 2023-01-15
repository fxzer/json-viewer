<template>
  <div class="search-wrap">
    <input
      class="search-input"
      type="text"
      placeholder="请输入节点名称"
      v-model.trim="keyword"
    />
    <span class="iconfont icon-search"></span>
    <span class="search-count" v-show="focusCount">{{ focusCount }} 个</span>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore ,useSearchStore} from "@/store";
const { currentTheme } = useThemeStore();
const { keyword ,focusCount} = toRefs(useSearchStore());
</script>
<style scoped lang="scss">
.search-wrap {
  display: flex;
  align-items: center;
  width: 200px;
  height: 30px;
  position: absolute;
  right: 60px;
  top: 5px;
  .search-input {
    display: inline-block;
    height: 100%;
    width: 100%;
    outline: none;
    padding: 2px  6px 2px 26px;
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
    left: 4px;
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
  .search-count{
    color:#33BB69;
    position: absolute;
    left:206px;
    font-size: 12px;
    white-space: nowrap;
  }
}
</style>
