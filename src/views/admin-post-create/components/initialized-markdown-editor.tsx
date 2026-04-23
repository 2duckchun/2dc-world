"use client"

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  codeBlockPlugin,
  DiffSourceToggleWrapper,
  diffSourcePlugin,
  headingsPlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  imagePlugin,
  ListsToggle,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  markdownShortcutPlugin,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor"
import type { ForwardedRef } from "react"
import { cn } from "@/shared/lib/utils"

type InitializedMarkdownEditorProps = {
  editorRef: ForwardedRef<MDXEditorMethods> | null
} & MDXEditorProps

const uploadImage = async (image: File) => {
  const presignResponse = await fetch("/api/admin/uploads/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contentType: image.type,
      size: image.size,
    }),
  })

  if (!presignResponse.ok) {
    throw new Error("Failed to prepare image upload")
  }

  const presign = (await presignResponse.json()) as {
    imageUrl: string
    uploadUrl: string
  }

  const uploadResponse = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": image.type,
    },
    body: image,
  })

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image")
  }

  return presign.imageUrl
}

export default function InitializedMarkdownEditor({
  className,
  contentEditableClassName,
  editorRef,
  ...props
}: InitializedMarkdownEditorProps) {
  return (
    <MDXEditor
      {...props}
      ref={editorRef}
      className={cn("admin-markdown-editor", className)}
      contentEditableClassName={cn(
        "prose prose-blog max-w-none min-h-[420px] px-4 py-4 dark:prose-invert",
        contentEditableClassName,
      )}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        thematicBreakPlugin(),
        tablePlugin(),
        codeBlockPlugin(),
        imagePlugin({ imageUploadHandler: uploadImage }),
        diffSourcePlugin({ viewMode: "rich-text" }),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper options={["rich-text", "source"]}>
              <UndoRedo />
              <Separator />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <Separator />
              <ListsToggle />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertCodeBlock />
              <InsertThematicBreak />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
    />
  )
}
