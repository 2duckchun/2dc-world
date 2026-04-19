import { publicProcedure } from "@/core/trpc/init"
import { getPublishedPostBySlug } from "@/domain/blog/procedure/read-model"
import { getBySlugInputSchema, getBySlugOutputSchema } from "./schema"

export const getBySlugProcedure = publicProcedure
  .input(getBySlugInputSchema)
  .output(getBySlugOutputSchema)
  .query(({ input }) => getPublishedPostBySlug(input.type, input.slug))
