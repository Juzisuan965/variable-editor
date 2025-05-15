# variable-editor

[![中文](https://img.shields.io/badge/lang-中文-red.svg)](README.md)
[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.en.md)

A rich text variable editor component for AI workflows, built with Vue 3 and TipTap.

## Introduction

variable-editor is a variable editor designed specifically for AI workflows, allowing users to easily insert, edit, and manage variables in rich text. These variables can be used as placeholders in AI prompts, facilitating the construction of dynamic AI workflows.

### Screenshots
<img width="866" alt="screenshot" src="https://github.com/user-attachments/assets/371ba40c-85b4-400e-9b26-4d12fd755b20" />


## Features

- 🚀 Easily insert and manage variables in text
- 🔍 Support for variable highlighting
- 🌲 Support for hierarchical structure variables
- 🎨 Customizable styles
- 📝 Intuitive text editing experience
- 💼 Suitable for AI prompts, workflow configuration, and other scenarios

## Installation

```bash
# npm
npm install variable-editor

# yarn
yarn add variable-editor

# pnpm
pnpm add variable-editor
```

## Usage

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import { VariableEditor } from "variable-editor";
import "variable-editor/dist/variable-editor.css";

// Define variables
const variables = ref<VariableType[]>([
  {
    label: "User Input",
    value: "input",
  },
  {
    label: "System Output",
    value: "output",
  },
]);

// Bind value
const value = ref<string>(
  "Please process {{#input.User Input#}} and generate {{#output.System Output#}}"
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

### Hierarchical Structure Variables

```vue
<script setup lang="ts">
import { ref } from "vue";
import { VariableEditor } from "variable-editor";
import "variable-editor/dist/variable-editor.css";

// Support for hierarchical structure variables
const variables = ref<VariableType[]>([
  {
    label: "User Features",
    value: "user_feature",
    children: [
      {
        label: "Height",
        value: "height",
      },
      {
        label: "Weight",
        value: "weight",
      },
    ],
  },
]);

const value = ref<string>(
  "The user's {{#user_feature:height.User Features:Height#}} is 180cm"
);
</script>
```

## Data Structures

### Variable Data Structure

```typescript
interface VariableType {
  label: string; // Display name
  value: string; // Variable value
  children?: VariableType[]; // Child variables
}
```

### Output Format

The editor outputs strings in a special format that can be parsed using utility functions:

```
"{{#input.User Input#}} is not empty, and {{#output.System Output#}} is normal"
```

## Utility Functions

```typescript
// Parse string to plain text content
import { parseRichTextToContent } from "variable-editor";

const text = "{{#input.User Input#}} is not empty";
const content = parseRichTextToContent(text); // "User Input is not empty"
```

Other exported utility functions:

- `parseRichTextEditorToString`: Convert editor JSON content to formatted string
- `parseStringToRichTextEditor`: Convert formatted string to editor JSON content

## Props

| Property   | Type             | Default  | Description                    |
| ---------- | ---------------- | -------- | ------------------------------ |
| variables  | `VariableType[]` | `[]`     | List of variables              |
| modelValue | `string`         | -        | Editor value (v-model binding) |
| width      | `string`         | `'100%'` | Editor width                   |
| height     | `string`         | `'100%'` | Editor height                  |

## License

MIT
