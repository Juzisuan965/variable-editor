<template>
    <div class="rich-text-editor" :style="{ width: width, height: height }">
        <editor-content :editor="editor" style="width: 100%; height: 200px" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import Document from '@tiptap/extension-document'
  import Mention from '@tiptap/extension-mention'
  import Paragraph from '@tiptap/extension-paragraph'
  import Text from '@tiptap/extension-text'
  import { Editor, EditorContent } from '@tiptap/vue-3'
  import { onBeforeUnmount, watch, ref } from 'vue'
  import { parseRichTextEditorToJSON, parseRichTextEditorToString } from '../utils'
  import type { VariableType } from './types'
  import suggestion from './suggestion.ts'
  const props = defineProps({
    width: {
      type: String,
      default: '500px',
    },
    height: {
      type: String,
      default: '300px',
    },
    modelValue: {
      type: String,
    },
    variables: {
      type: Array as () => VariableType[],
      default: () => [] as VariableType[],
    },
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  // 添加watch以重新配置suggestion当variables改变时
  const currentVariables = ref<VariableType[]>(props.variables as VariableType[])
  
  watch(
    () => props.variables,
    (newVars) => {
      currentVariables.value = newVars as VariableType[]
    },
    { deep: true, immediate: true }
  )
    
  const editor = new Editor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        renderHTML: ({ node, options }) => {
          return ['span', options.HTMLAttributes, node.attrs.label.split('<<$$>>')[0] ?? node.attrs.id]
        },
        deleteTriggerWithBackspace: true,
        suggestion: suggestion(currentVariables.value)
      }),
    ],
    content: ``,
    onUpdate: () => {
      // HTML
      emit('update:modelValue', parseRichTextEditorToString(editor.getJSON()))
    },
  })
  
  const insertMention = (item: VariableType) => {
    editor.commands.focus()
    editor.commands.insertContent({
      type: 'mention',
      attrs: {
        id: item.value,
        label: item.label,
      },
    })
  }
  
  // 处理级联选择
  const handleCascadeSelection = (parentItem: VariableType, childItem: VariableType) => {
    if (parentItem && childItem) {
      editor.commands.focus()
      editor.commands.insertContent({
        type: 'mention',
        attrs: {
          id: `${parentItem.value}.${childItem.value}`,
          label: `${parentItem.label}.${childItem.label}<<$$>>${childItem.value}`,
        },
      })
    }
  }
  
  const handleSelectChange = (item: VariableType) => {
    // 检查是否为级联选择的项（包含childValue和childLabel）
    if ('childValue' in item && 'childLabel' in item) {
      // 处理级联选择的情况
      const parentValue = item.value.split('.')[0]
      const parentItem = props.variables.find(v => v.value === parentValue)
      
      if (parentItem) {
        const childValue = (item as any).childValue
        const childItem = parentItem.children?.find(c => c.value === childValue)
        
        if (childItem) {
          handleCascadeSelection(parentItem, childItem)
          return
        }
      }
    }
    
    // 常规项的处理
    insertMention(item)
  }
  
  watch(
    () => props.modelValue,
    (newVal) => {
      // @ts-ignore
      editor.commands.setContent(parseRichTextEditorToJSON(newVal))
    },
    {
      immediate: true,
      once: true,
    }
  )
  
  // 动态更新suggestion配置
  watch(
    () => currentVariables.value,
    (newVariables) => {
      // 获取mention扩展并更新suggestion
      const mentionExtension = editor.extensionManager.extensions.find(ext => ext.name === 'mention')
      if (mentionExtension) {
        mentionExtension.options.suggestion = suggestion(newVariables)
      }
    },
    { deep: true }
  )
  
  onBeforeUnmount(() => {
    editor.destroy()
  })
  </script>
  
  <style lang="less" scoped>
  .rich-text-editor {
    :deep(.tiptap) {
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 8px;
        border: 1px solid #e3ebee;
        border-radius: 4px;
        transition: all 0.1s ease-in-out;
  
        &:hover {
          border-color: rgb(78, 115, 222);
        }
  
        &:focus {
          border-color: rgb(78, 115, 222);
          outline: none !important;
        }
  
        &:focus-visible {
          outline: none !important;
        }
  
        p {
          margin: 0;
        }
      }
      :deep(.mention) {
        padding: 2px 4px;
        background-color: rgba(88, 5, 255, .05);
        border-radius: 4px;
        box-decoration-break: clone;
        color: #6A00F5;
        :hover {
          border-radius: 4px;
        }
      }
  }
</style>
  