# variable-editor

[![中文](https://img.shields.io/badge/lang-中文-red.svg)](README.md)
[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.en.md)

一个适用于 AI 工作流的富文本变量编辑器组件，基于 Vue 3 和 TipTap 实现。

## 介绍

variable-editor 是一个专为 AI 工作流设计的变量编辑器，它允许用户在富文本中方便地插入、编辑和管理变量。这些变量可以在 AI 提示词中作为占位符使用，便于构建动态的 AI 工作流程。

### 截图
<img width="866" alt="screenshot" src="https://github.com/user-attachments/assets/4fb4f1cc-c7de-40fc-8137-04aed0893ea0" />


## 特性

- 🚀 便捷地在文本中插入和管理变量
- 🔍 支持变量高亮显示
- 🌲 支持层级结构变量
- 🎨 可自定义样式
- 📝 直观的文本编辑体验
- 💼 适用于 AI 提示词、工作流配置等场景

## 安装

```bash
# npm
npm install variable-editor

# yarn
yarn add variable-editor

# pnpm
pnpm add variable-editor
```

## 使用方法

### 基础使用

```vue
<script setup lang="ts">
import { ref } from "vue";
import { VariableEditor } from "variable-editor";
import "variable-editor/dist/variable-editor.css";

// 定义变量
const variables = ref<VariableType[]>([
  {
    label: "用户输入",
    value: "input",
  },
  {
    label: "系统输出",
    value: "output",
  },
]);

// 绑定值
const value = ref<string>(
  "请处理{{#input.用户输入#}}并生成{{#output.系统输出#}}"
);
</script>

<template>
  <VariableEditor
    :variables="variables"
    v-model="value"
    width="100%"
    height="200px"
  />
</template>
```

### 层级结构变量

```vue
<script setup lang="ts">
import { ref } from "vue";
import { VariableEditor } from "variable-editor";
import "variable-editor/dist/variable-editor.css";

// 支持层级结构变量
const variables = ref<VariableType[]>([
  {
    label: "用户特征",
    value: "user_feature",
    children: [
      {
        label: "身高",
        value: "height",
      },
      {
        label: "体重",
        value: "weight",
      },
    ],
  },
]);

const value = ref<string>(
  "用户的{{#user_feature:height.用户特征:身高#}}是180cm"
);
</script>
```

## 数据结构

### 变量数据结构

```typescript
interface VariableType {
  label: string; // 显示名称
  value: string; // 变量值
  children?: VariableType[]; // 子变量
}
```

### 输出格式

编辑器输出的字符串采用特殊格式，可以通过工具函数进行解析：

```
"{{#input.用户输入#}} 不为空，且 {{#output.系统输出#}} 正常"
```

## 工具函数

```typescript
// 将字符串解析为纯文本内容
import { parseRichTextToContent } from "variable-editor";

const text = "{{#input.用户输入#}} 不为空";
const content = parseRichTextToContent(text); // "用户输入 不为空"
```

其他导出的工具函数：

- `parseRichTextEditorToString`: 将编辑器 JSON 内容转换为格式化字符串
- `parseStringToRichTextEditor`: 将格式化字符串转换为编辑器 JSON 内容

## Props

| 属性       | 类型             | 默认值   | 描述                       |
| ---------- | ---------------- | -------- | -------------------------- |
| variables  | `VariableType[]` | `[]`     | 变量列表                   |
| modelValue | `string`         | -        | 编辑器的值（v-model 绑定） |
| width      | `string`         | `'100%'` | 编辑器宽度                 |
| height     | `string`         | `'100%'` | 编辑器高度                 |

## 许可证

MIT
