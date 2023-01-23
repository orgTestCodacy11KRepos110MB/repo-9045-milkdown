/* Copyright 2021, Milkdown by Mirone. */

import { inject } from 'vue'
import { editorInfoCtxKey } from './Editor'

import type { GetEditor, UseEditorReturn } from './types'

export const useEditor = (getEditor: GetEditor): UseEditorReturn => {
  const { editorFactory, loading, editor } = inject(editorInfoCtxKey)!

  editorFactory.value = getEditor

  return {
    loading,
    get: () => editor.value,
  }
}
