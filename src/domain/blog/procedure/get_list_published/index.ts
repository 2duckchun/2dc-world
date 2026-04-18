import { publicProcedure } from "@/core/trpc/init"
import { listPublishedPosts } from "@/domain/blog/lib/repository"
import {
  getListPublishedInputSchema,
  getListPublishedOutputSchema,
} from "./schema"

export const getListPublishedProcedure = publicProcedure
  .input(getListPublishedInputSchema)
  .output(getListPublishedOutputSchema)
  .query(({ input }) => listPublishedPosts(input.type))
