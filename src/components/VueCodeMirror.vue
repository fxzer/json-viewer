<script setup lang='ts'>
defineProps(['style'])
const code = defineModel<string>()
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
const extensions = [json()]

</script>

<template>
  <codemirror v-model="code" placeholder="Code here..." :style="style" :indent-with-tab="true" :tab-size="2"
    :extensions="extensions"></codemirror>
</template>

<style scoped lang='scss'></style>
