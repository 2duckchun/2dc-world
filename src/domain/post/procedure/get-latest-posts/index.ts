import { desc, eq } from "drizzle-orm"
import { posts } from "@/core/db/schema"
import { publicProcedure } from "@/core/trpc/init"
import { getLatestPostsInputSchema, getLatestPostsOutputSchema } from "./schema"

export const getLatestPostsProcedure = publicProcedure
  .input(getLatestPostsInputSchema)
  .output(getLatestPostsOutputSchema)
  .query(async ({ ctx, input }) =>
    ctx.db.query.posts.findMany({
      columns: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        thumbnail: true,
        publishedAt: true,
        createdAt: true,
      },
      where: eq(posts.status, "published"),
      orderBy: [desc(posts.publishedAt), desc(posts.createdAt)],
      limit: input.limit,
    }),
  )
