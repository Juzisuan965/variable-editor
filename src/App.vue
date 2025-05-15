<script setup lang="ts">
import { ref, watch } from "vue";
import AIVariableEditor from "./components/AIVariableEditor.vue";
import { parseRichTextToContent } from "./utils";
import type { VariableType } from "./components/types";

const variables = ref<VariableType[]>([
  {
    label: "输入",
    value: "input",
  },
  {
    label: "输出",
    value: "output",
  },
  {
    label: "用户特征",
    value: "user_feature",
    children: [
      {
        label: "身高",
        value: "1",
      },
      {
        label: "体重",
        value: "2",
      },
      {
        label: "年龄",
        value: "3",
      },
    ],
  },
  {
    label: "内置变量",
    value: "builtin_variable",
    children: [
      {
        label: "当前时间",
        value: "current_time",
      },
      {
        label: "长期记忆",
        value: "long_term_memory",
      },
    ],
  },
]);
const value = ref<string>(
  "{{#input.输入#}} 不为空，且{{#builtin_variable:long_term_memory.内置变量:长期记忆#}} 开启，筛选出{{#user_feature:3.用户特征:年龄#}} 大于20岁。如果{{#builtin_variable:long_term_memory.内置变量:长期记忆#}} 未开启，则{{#output.输出#}} '请配置参数'"
);

watch(value, (newVal) => {
  console.log(newVal);
});
</script>

<template>
  <div class="container">
    <div class="editor-container">
      <AIVariableEditor :variables="variables" v-model="value" />
    </div>
    <div class="data-container">
      <div>
        <span>props: </span>
        <div>{{ variables }}</div>
      </div>
      <div>
        <span>v-modal: </span>
        <div>{{ value }}</div>
      </div>
      <div>
        <span>展示文案: </span>
        <div>{{ parseRichTextToContent(value) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.container {
  width: 800px;
  height: 500px;
  padding: 20px;
  border: 1px solid #ebe7e7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .editor-container {
    width: 100%;
    height: 300px;
  }
  .data-container {
    width: 100%;
    height: 100%;
    gap: 20px;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    span {
      font-weight: bold;
      color: #7bc616;
      margin-right: 8px;
    }
  }
}
</style>
