/* Copyright 2021, Milkdown by Mirone. */
/* eslint-disable vue/one-component-per-file */
import { Editor, defaultValueCtx, rootCtx } from '@milkdown/core'
import { slash } from '@milkdown/plugin-slash'
import { blockquote, commonmarkNodes, commonmarkPlugins, heading, image, paragraph } from '@milkdown/preset-commonmark'
import { nord } from '@milkdown/theme-nord'
import type { EditorRef } from '@milkdown/vue'
import { VueEditor, nodeMetadata, useEditor } from '@milkdown/vue'
import type { DefineComponent } from 'vue'
import { defineComponent, h, inject, ref } from 'vue'

const MyParagraph: DefineComponent = defineComponent({
  name: 'MyParagraph',
  setup(_, { slots }) {
    return () => <div class="my-paragraph">{slots.default?.()}</div>
  },
})
const MyHeading = defineComponent({
  name: 'MyHeading',
  setup: (_, { slots }) => {
    const node = inject(nodeMetadata)?.node
    return () => {
      return (
        <div class={`my-heading ${!node?.attrs.level ? '' : `heading${node?.attrs.level}`}`}>
          {slots.default?.()}
        </div>
      )
    }
  },
})
const MyImage: DefineComponent = defineComponent({
  name: 'MyImage',
  setup() {
    const node = inject(nodeMetadata)?.node
    return () => <img class="image" src={node?.attrs.src} alt={node?.attrs.alt} />
  },
})
const MyQuote: DefineComponent = defineComponent({
  name: 'MyQuote',
  setup(_, { slots }) {
    return () => <section class="my-quote">{slots.default?.()}</section>
  },
})

export const MyEditor = defineComponent<{ markdown: string }>({
  name: 'MyEditor',
  setup: (props) => {
    const editorRef = ref<EditorRef>({ get: () => undefined, dom: () => null })
    // effect(() => {
    //     setTimeout(() => {
    //         console.log(editorRef.value.get());
    //     }, 100);
    // });
    const editor = useEditor((root, renderVue) => {
      const nodes = commonmarkNodes
        .configure(heading, {
          view: renderVue(MyHeading, { as: 'header' }),
        })
        .configure(paragraph, {
          view: renderVue(MyParagraph, { as: 'p' }),
        })
        .configure(blockquote, {
          view: renderVue(MyQuote),
        })
        .configure(image, {
          view: renderVue(MyImage),
        })
      return Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root)
          ctx.set(defaultValueCtx, props.markdown)
        })
        .use(nord)
        .use(nodes)
        .use(commonmarkPlugins)
        .use(slash)
    })

    return () => <VueEditor editorRef={editorRef} editor={editor} />
  },
})
MyEditor.props = ['markdown']
