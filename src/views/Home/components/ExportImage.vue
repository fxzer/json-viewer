<template>
  <el-dialog v-model="visible" title="将画布导出为图片" width="376">
    <el-form label-width="72px">
      <el-form-item label="图片名称">
        <el-input
          v-model="exportConfig.name"
          placeholder="请输入导出图片名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="导出格式">
        <el-radio-group v-model="exportConfig.type">
          <el-radio-button
            :label="typeItem"
            v-for="(typeItem, key) of imageTypes"
            :key="typeItem"
            >{{ key }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图片背景">
        <el-color-picker
          v-model="exportConfig.backgroundColor"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="visible = false">关闭</el-button>
        <el-button  @click="confirm" type="primary">导出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed,  } from "vue";
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits({
  "update:value": (val: boolean) => true,
  confirm: (val: any) => true,
});
const visible = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit("update:value", val);
  },
});
const imageTypes = reactive({
  PNG: "image/png",
  JPEG: "image/jpeg",
  WEBP: "image/webp",
  BMP: "image/bmp",
});
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);
const exportConfig = ref({
  name: "json-viewer",
  type: "image/png",
  padding: 20,
  backgroundColor: "#fff",
});

const confirm = () => {
  emit("confirm", exportConfig.value);
  console.log(exportConfig.value);
  visible.value = false;
};
</script>
<style scoped lang="scss"></style>
