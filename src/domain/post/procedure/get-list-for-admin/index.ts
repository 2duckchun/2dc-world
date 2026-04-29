import { desc } from "drizzle-orm"
import { posts } from "@/core/db/schema"
import { adminProcedure } from "@/core/trpc/base/procedures/admin-procedure"
import {
  postListForAdminInputSchema,
  postListForAdminOutputSchema,
} from "./schema"

export const postListForAdminProcedure = adminProcedure
  .input(postListForAdminInputSchema)
  .output(postListForAdminOutputSchema)
  .query(async ({ ctx }) =>
    ctx.db.query.posts.findMany({
      columns: {
        id: true,
        title: true,
        slug: true,
        kind: true,
        status: true,
        seriesOrder: true,
        publishedAt: true,
        updatedAt: true,
      },
      with: {
        series: {
          columns: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [desc(posts.updatedAt), desc(posts.createdAt)],
    }),
  )
