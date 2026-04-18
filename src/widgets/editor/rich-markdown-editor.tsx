"use client"

import { $createCodeNode } from "@lexical/code"
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list"
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import {
  INSERT_TABLE_COMMAND,
  TableCellNode,
  TableNode,
  TableRowNode,
} from "@lexical/table"
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  type EditorState,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import { Button } from "@/shared/ui/button"

type RichMarkdownEditorProps = {
  markdown: string
  editorKey: string
  onChange: (markdown: string) => void
}

function Placeholder() {
  return (
    <div className="pointer-events-none absolute top-4 left-4 text-sm text-muted-foreground">
      Write in Lexical, store as Markdown.
    </div>
  )
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  const setBlock = (kind: "paragraph" | "h2" | "h3" | "quote" | "code") => {
    editor.update(() => {
      const selection = $getSelection()

      if (!$isRangeSelection(selection)) {
        return
      }

      if (kind === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode())
        return
      }

      if (kind === "h2" || kind === "h3") {
        $setBlocksType(selection, () => $createHeadingNode(kind))
        return
      }

      if (kind === "quote") {
        $setBlocksType(selection, () => $createQuoteNode())
        return
      }

      $setBlocksType(selection, () => $createCodeNode())
    })
  }

  return (
    <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        Undo
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        Redo
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        Bold
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        Italic
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        Underline
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setBlock("paragraph")}
      >
        Paragraph
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setBlock("h2")}
      >
        H2
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setBlock("h3")}
      >
        H3
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setBlock("quote")}
      >
        Quote
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setBlock("code")}
      >
        Code
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
      >
        Bullets
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
      >
        Numbers
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const href = window.prompt("Enter a URL")
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, href || null)
        }}
      >
        Link
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: "3",
            rows: "3",
            includeHeaders: true,
          })
        }
      >
        Table
      </Button>
    </div>
  )
}

export function RichMarkdownEditor({
  markdown,
  editorKey,
  onChange,
}: RichMarkdownEditorProps) {
  return (
    <LexicalComposer
      key={editorKey}
      initialConfig={{
        namespace: "2dc-world-rich-markdown-editor",
        nodes: [
          HeadingNode,
          QuoteNode,
          ListNode,
          ListItemNode,
          LinkNode,
          TableNode,
          TableCellNode,
          TableRowNode,
        ],
        editorState: () => {
          $convertFromMarkdownString(markdown, TRANSFORMERS, undefined, true)
        },
        onError(error) {
          throw error
        },
      }}
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              aria-placeholder="Write your post"
              placeholder={<Placeholder />}
              className="min-h-[420px] px-4 py-4 outline-none"
            />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(_editorState: EditorState, editor) => {
            editor.update(() => {
              onChange($convertToMarkdownString(TRANSFORMERS, undefined, true))
            })
          }}
          ignoreSelectionChange
        />
        <ListPlugin />
        <LinkPlugin />
        <TablePlugin hasHorizontalScroll />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </div>
    </LexicalComposer>
  )
}
