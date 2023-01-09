<template>
  <el-dialog title="指定额外解析字段" v-model="visible" width="480">
    <el-form label-width="72px">
      <el-form-item label="本地保存">
        <el-switch
          v-model="isStorage"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="字段名称">
        <div class="fields-edit">
          <el-tag
            v-for="(field, index) in fieldsTemp"
            :key="index"
            class="mx-1"
            :type="handleType(index)"
            closable
            :disable-transitions="false"
            @close="handleClose(index)"
          >
            {{ field }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="inputRef"
            v-model="inputValue"
            placeholder="回车确认"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else size="small" @click="showInput"> + 添加 </el-button>
        </div>
      </el-form-item>
    </el-form>

    <p class="fields-info">
      <span class="info-prefix">额外解析字段：</span>
      指定后，遇到此字段会将对应的值时，会将其解析为JSON并继续递归处理，并转化为子树。
    </p>
    <template #footer>
      <span>
        <el-button  @click="visible = false">取消</el-button>
        <el-button  type="primary" @click="confirm">应用</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, computed, watch  } from "vue";
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  fields: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits({
  "update:value": (val: boolean) => true,
  "update:fields": (fields: any, isStorage: boolean) => true,
});
const handleType = (index: number) => {
  return ["success", "info", "warning"][index % 3] as any;
};
const visible = computed({
  get() {
    return props.value;
  },
  set(val) {
    emit("update:value", val);
  },
});
watch(
  () => visible.value,
  (val) => {
    if (val) {
      let fstr = localStorage.getItem("extraFields");
      fieldsTemp.value = fstr ? JSON.parse(fstr) : [];
      isStorage.value = !!localStorage.getItem("isStorage")  
    }
  }
);

const fieldsTemp = ref(JSON.parse(JSON.stringify(props.fields)));
const confirm = () => {
  emit("update:fields", fieldsTemp.value, isStorage.value);
  emit("update:value", false);
};

//标签
const inputValue = ref("");
const inputVisible = ref(false);
const inputRef = ref(null);

const handleClose = (index: number) => {
  fieldsTemp.value.splice(index, 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    inputRef.value?.input?.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    fieldsTemp.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};
//是否本地保存
const isStorage = ref(false);
</script>
<style scoped lang="scss">
.fields-edit {
  max-width: 400px;
  display: flex;
  flex-wrap: wrap;
  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .el-input {
    width: 120px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
}
.fields-info {
  background-color: #f5f5f5;
  font-size: 12px;
  margin-top: 10px;
  padding: 10px;
  line-height: 1.5;
  .info-prefix {
    color: #fbb32e;
  }
}
html.dark .fields-info {
  background-color: #363636;
}
</style>
