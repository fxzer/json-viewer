<template>
  <el-dialog title="指定额外解析字段" v-model="visible" width="400">
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
            v-for="(field, index) in fields"
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
            @keyup.enter="addField"
            @blur="addField"
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
        <el-button  @click="visible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useFieldsStore  } from "@/store";
const { isStorage,fields } = toRefs(useFieldsStore())
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits({
  "update:value": (val: boolean) => true,
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
//标签
const inputValue = ref("");
const inputVisible = ref(false);

const inputRef =  ref<InstanceType<typeof ElInput>>()

const handleClose = (index: number) => {
  fields.value.splice(index, 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    inputRef.value!.input!.focus()
  });
};

const addField = () => {
  if (inputValue.value) {
    fields.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};
//是否本地保存
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
