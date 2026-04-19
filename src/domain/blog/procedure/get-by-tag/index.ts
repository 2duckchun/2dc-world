import { publicProcedure } from "@/core/trpc/init"
import { getPublishedPostsByTagName } from "@/domain/blog/procedure/read-model"
import { getByTagInputSchema, getByTagOutputSchema } from "./schema"

export const getByTagProcedure = publicProcedure
  .input(getByTagInputSchema)
  .output(getByTagOutputSchema)
  .query(({ input }) => getPublishedPostsByTagName(input.tagName))
