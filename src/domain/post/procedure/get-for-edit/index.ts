import { eq } from "drizzle-orm"
import { posts } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import { postGetForEditInputSchema, postGetForEditOutputSchema } from "./schema"

export const postGetForEditProcedure = adminProcedure
  .input(postGetForEditInputSchema)
  .output(postGetForEditOutputSchema)
  .query(async ({ ctx, input }) => {
    const post = await ctx.db.query.posts.findFirst({
      columns: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        thumbnail: true,
        content: true,
        kind: true,
        status: true,
        seriesId: true,
        seriesOrder: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      where: eq(posts.id, input.id),
      with: {
        postTags: {
          columns: {},
          with: {
            tag: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!post) {
      return null
    }

    return {
      ...post,
      tags: post.postTags
        .map(({ tag }) => tag.name)
        .sort((firstTag, secondTag) =>
          firstTag.localeCompare(secondTag, "ko-KR"),
        ),
    }
  })
