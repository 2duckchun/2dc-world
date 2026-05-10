import { and, asc, eq, inArray, isNull } from "drizzle-orm"
import { postComments } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/base/procedures/public-procedure"
import { commentGetListInputSchema, commentGetListOutputSchema } from "./schema"

type CommentRowWithAuthor = {
  id: string
  body: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  authorId: string
  parentCommentId: string | null
  author: { id: string; name: string | null; image: string | null } | null
}

export const commentGetListProcedure = publicProcedure
  .input(commentGetListInputSchema)
  .output(commentGetListOutputSchema)
  .query(async ({ ctx, input }) => {
    const viewer = ctx.session?.user ?? null
    const viewerId = viewer?.id ?? null
    const viewerIsAdmin = viewer?.role === "admin"

    const topLevelRows = await ctx.db.query.postComments.findMany({
      where: and(
        eq(postComments.postId, input.postId),
        isNull(postComments.parentCommentId),
      ),
      orderBy: asc(postComments.createdAt),
      with: {
        author: {
          columns: { id: true, name: true, image: true },
        },
      },
    })

    const replyRows = topLevelRows.length
      ? await ctx.db.query.postComments.findMany({
          where: inArray(
            postComments.parentCommentId,
            topLevelRows.map((row) => row.id),
          ),
          orderBy: asc(postComments.createdAt),
          with: {
            author: {
              columns: { id: true, name: true, image: true },
            },
          },
        })
      : []

    const repliesByParent = new Map<string, ReturnType<typeof shapeComment>[]>()

    for (const reply of replyRows) {
      if (!reply.parentCommentId) continue
      const list = repliesByParent.get(reply.parentCommentId) ?? []
      list.push(shapeComment(reply, viewerId, viewerIsAdmin))
      repliesByParent.set(reply.parentCommentId, list)
    }

    return topLevelRows.map((row) => ({
      ...shapeComment(row, viewerId, viewerIsAdmin),
      replies: repliesByParent.get(row.id) ?? [],
    }))
  })

function shapeComment(
  row: CommentRowWithAuthor,
  viewerId: string | null,
  viewerIsAdmin: boolean,
) {
  const isOwner = viewerId !== null && row.authorId === viewerId

  return {
    id: row.id,
    body: row.isDeleted ? "" : row.body,
    isDeleted: row.isDeleted,
    isEdited: !row.isDeleted && row.updatedAt > row.createdAt,
    createdAt: row.createdAt.toISOString(),
    author: row.author,
    canEdit: !row.isDeleted && isOwner,
    canDelete: !row.isDeleted && (isOwner || viewerIsAdmin),
  }
}
