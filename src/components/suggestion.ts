import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import type { VariableType } from './types'

import MentionList from './MentionList.vue'

export default (variables: VariableType[]) => ({
  allowedPrefixes: null,
  char: '/',
  items: ({ query }: { query: string }) => {
    if (variables && variables.length > 0) {
      return variables
        .filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    }
    return []
  },
  render: () => {
    let component: any
    let popup: any

    return {
      onStart: (props: any) => {
        component = new VueRenderer(MentionList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props: any) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
})