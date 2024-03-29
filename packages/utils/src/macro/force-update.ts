/* Copyright 2021, Milkdown by Mirone. */
import type { Ctx } from '@milkdown/core'
import { editorViewCtx } from '@milkdown/core'

export const forceUpdate
    = () =>
      (ctx: Ctx): void => {
        const view = ctx.get(editorViewCtx)
        const { tr } = view.state

        const nextTr = Object.assign(Object.create(tr), tr).setTime(Date.now())
        return view.dispatch(nextTr)
      }
