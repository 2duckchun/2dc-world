import { TRPCError } from "@trpc/server"
import { publicProcedure } from "@/core/trpc/init"
import { getPublishedPostBySlug } from "@/domain/blog/lib/repository"
import { getBySlugInputSchema, getBySlugOutputSchema } from "./schema"

export const getBySlugProcedure = publicProcedure
  .input(getBySlugInputSchema)
  .output(getBySlugOutputSchema)
  .query(async ({ input }) => {
    const post = await getPublishedPostBySlug(input)

    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND" })
    }

    return post
  })
