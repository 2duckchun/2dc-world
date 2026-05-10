import { z } from "zod"

const commentAuthorSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
})

const commentBaseSchema = z.object({
  id: z.string(),
  body: z.string(),
  isDeleted: z.boolean(),
  isEdited: z.boolean(),
  createdAt: z.string(),
  author: commentAuthorSchema.nullable(),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
})

const commentReplySchema = commentBaseSchema

const commentTopLevelSchema = commentBaseSchema.extend({
  replies: z.array(commentReplySchema),
})

export const commentGetListInputSchema = z.object({
  postId: z.string().min(1, "게시글 식별자가 필요합니다."),
})

export const commentGetListOutputSchema = z.array(commentTopLevelSchema)

export type CommentGetListInput = z.input<typeof commentGetListInputSchema>
export type CommentGetListOutput = z.output<typeof commentGetListOutputSchema>
