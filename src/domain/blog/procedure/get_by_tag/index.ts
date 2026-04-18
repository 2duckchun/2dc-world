import { TRPCError } from "@trpc/server"
import { publicProcedure } from "@/core/trpc/init"
import { getPostsByTag } from "@/domain/blog/lib/repository"
import { getByTagInputSchema, getByTagOutputSchema } from "./schema"

export const getByTagProcedure = publicProcedure
  .input(getByTagInputSchema)
  .output(getByTagOutputSchema)
  .query(async ({ input }) => {
    const results = await getPostsByTag(input.tagName)

    if (!results) {
      throw new TRPCError({ code: "NOT_FOUND" })
    }

    return results
  })
