/* Copyright 2021, Milkdown by Mirone. */
import { commandsCtx } from '@milkdown/core'
import { wrapIn } from '@milkdown/prose/commands'
import { wrappingInputRule } from '@milkdown/prose/inputrules'
import type { $NodeSchema } from '@milkdown/utils'
import { $command, $inputRule, $nodeAttr, $nodeSchema, $useKeymap } from '@milkdown/utils'

export const blockquoteAttr = $nodeAttr('blockquote')

export const blockquoteSchema: $NodeSchema<'blockquote'> = $nodeSchema('blockquote', ctx => ({
  content: 'block+',
  group: 'block',
  defining: true,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM: node => ['blockquote', ctx.get(blockquoteAttr.key)(node), 0],
  parseMarkdown: {
    match: ({ type }) => type === 'blockquote',
    runner: (state, node, type) => {
      state.openNode(type).next(node.children).closeNode()
    },
  },
  toMarkdown: {
    match: node => node.type.name === 'blockquote',
    runner: (state, node) => {
      state.openNode('blockquote').next(node.content).closeNode()
    },
  },
}))

export const wrapInBlockquoteInputRule = $inputRule(() => wrappingInputRule(/^\s*>\s$/, blockquoteSchema.type()))

export const wrapInBlockquoteCommand = $command('WrapInBlockquote', () => () => wrapIn(blockquoteSchema.type()))

export const blockquoteKeymap = $useKeymap('blockquoteKeymap', {
  WrapInBlockquote: {
    shortcuts: 'Mod-Shift-b',
    command: (ctx) => {
      const commands = ctx.get(commandsCtx)
      return () => commands.call(wrapInBlockquoteCommand.key)
    },
  },
})
