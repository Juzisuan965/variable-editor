import type { JSONContent } from '@tiptap/vue-3'

export const parseRichTextEditorToString = (jsonContent: JSONContent) => {
    let text = ''
    if (jsonContent && jsonContent.content) {
      jsonContent.content[0].content?.forEach((item: any) => {
        if (item.type === 'mention') {
          const key = item.attrs.id
          const value = item.attrs.label.split('<<$$>>')[1] || 'all'
          text += `{{#${key}.${value}#}}`
        } else if (item.type === 'text') {
          text += item.text
        }
      })
    }
    return text
  }
  
  const getName = (key: string, value: string) => {
    if (key === FilterCondition.satisfaction) {
      return `${satisfactionList.value.find((item) => item.id === value)?.name || descDict.value[value]}<<$$>>${value}`
    } else if (key === FilterCondition.wecom_ids) {
      return `${wecomList.value.find((item) => item.id === value)?.name || descDict.value[value]}<<$$>>${value}`
    } else if (key === FilterCondition.wework_labels) {
      return `${labelsList.value.find((item) => item.id === value)?.name || descDict.value[value]}<<$$>>${value}`
    } else {
      return FilterConditionKeyMap[key as FilterCondition]
    }
  }
  
  export const parseRichTextEditorToJSON = (text: string): JSONContent => {
    const doc: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    }
  
    if (!text) return doc
  
    // 使用正则表达式匹配所有标签
    const regex = /{{#(.*?)#}}/g
    let lastIndex = 0
    let match
  
    // 遍历所有匹配项
    while ((match = regex.exec(text)) !== null) {
      // 添加标签前的文本
      if (match.index > lastIndex) {
        const normalText = text.substring(lastIndex, match.index)
        if (normalText) {
          doc.content![0].content!.push({
            type: 'text',
            text: normalText,
          })
        }
      }
  
      // 处理标签内容
      const tagContent = match[1]
      const [key, value] = tagContent.split('.')
      let label = ''
  
      if (value === 'all') {
        if (StaticFilterConditions.includes(key as FilterCondition)) {
          label = FilterConditionKeyMap[key as FilterCondition]
        } else {
          label = getName(key, value) || ''
        }
      } else {
        label = getName(key, value) || ''
      }
  
      doc.content![0].content!.push({
        type: 'mention',
        attrs: {
          id: key,
          label: label,
        },
      })
  
      // 更新索引位置
      lastIndex = match.index + match[0].length
    }
  
    // 添加最后一段文本（如果有）
    if (lastIndex < text.length) {
      doc.content![0].content!.push({
        type: 'text',
        text: text.substring(lastIndex),
      })
    }
    return doc
  }
  
  export const parseRichTextToContent = (text: string) => {
    const json = parseRichTextEditorToJSON(text)
    let content = ''
    if (!json.content || !json.content[0].content) return ''
    json.content[0].content?.forEach((item: any) => {
      if (item.type === 'mention') {
        content += item.attrs.label.split('<<$$>>')[0] || item.attrs.label
      } else if (item.type === 'text') {
        content += item.text
      }
    })
    return content
  }
  