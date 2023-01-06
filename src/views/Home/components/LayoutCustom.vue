<template>
  <el-drawer
    v-model="visible"
    title="布局配置"
    :with-header="true"
    :modal="false"
    append-to-body
    modal-class="layout-modal"
    direction="ltr"
    size="450"
    close-on-press-escape
  >
    <LayoutOptions   />
    <div class="layout-custom">
      <el-form label-width="80px" :inline="false">
        <!-- 共有方向 -->
        <el-form-item label="布局方向">
          <el-radio-group v-model="config.direction">
            <el-radio-button
              v-for="direction in config.directions"
              :key="direction"
              :label="direction"
            >
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!--indented缩进树  -->
        <div class="indented" v-if="type == 'indented'">
          <el-form-item label="节点换行">
            <el-switch
              v-model="config.dropCap"
              :active-value="true"
              :inactive-value="false"
              inline-prompt
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="缩进距离">
            <el-input v-model.number="config.indent">
              <template #append>px</template>
            </el-input>
          </el-form-item>
        </div>
        <!--dendrogram生态树  -->
        <div class="dendrogram" v-if="type == 'dendrogram'">
          <el-form-item label="是否径向">
            <el-switch
              v-model="config.radial"
              :active-value="true"
              :inactive-value="false"
              inline-prompt
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="层级间距">
            <el-input v-model.number="config.rankSep">
              <template #append>px</template>
            </el-input>
          </el-form-item>
          <el-form-item label="节点间距">
            <el-input v-model.number="config.nodeSep">
              <template #append>px</template>
            </el-input>
          </el-form-item>
        </div>
        <!--  mindmap脑图树-->
        <div class="mindmap" v-if="type == 'mindmap'">
          <el-form-item label="布局模式">
            <el-radio-group v-model="config.autoMode">
              <el-radio-button :label="true">自动计算 </el-radio-button>
              <el-radio-button :label="false">手动定义 </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <div class="custom-mode" v-if="!config.autoMode">
            <el-form-item label="节点换行">
              <el-switch
                v-model="config.dropCap"
                :active-value="true"
                :inactive-value="false"
                inline-prompt
                active-text="是"
                inactive-text="否"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="水平间距">
              <el-input v-model.number="config.hgap">
                <template #append>px</template>
              </el-input>
            </el-form-item>
            <el-form-item label="垂直间距">
              <el-input v-model.number="config.vgap">
                <template #append>px</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <!-- compactBox紧凑树 -->
        <div class="compactBox" v-if="type == 'compactBox'">
          <el-form-item label="是否径向">
            <el-switch
              v-model="config.radial"
              :active-value="true"
              :inactive-value="false"
              inline-prompt
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="水平间距">
            <el-input v-model.number="config.hgap">
              <template #append>px</template>
            </el-input>
          </el-form-item>
          <el-form-item label="垂直间距">
            <el-input v-model.number="config.vgap">
              <template #append>px</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref,toRefs, computed, reactive, watch } from "vue";
import LayoutOptions from "./LayoutOptions.vue";
import useStore from "@/store/index";
const { layout } = useStore();
//toRefs将对象转换为响应式的ref对象
const { type, config } = toRefs(layout);
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
});
//弹窗相关
const emit = defineEmits(["update:value"]);
const visible = computed({
  get() {
    return props.value;
  },
  set(val) {
    emit("update:value", val);
  },
});

</script>
<style scoped lang="scss"></style>
