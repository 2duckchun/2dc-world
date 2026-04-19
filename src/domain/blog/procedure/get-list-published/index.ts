import { publicProcedure } from "@/core/trpc/init"
import { listPublishedPostsByType } from "@/domain/blog/procedure/read-model"
import {
  getListPublishedInputSchema,
  getListPublishedOutputSchema,
} from "./schema"

export const getListPublishedProcedure = publicProcedure
  .input(getListPublishedInputSchema)
  .output(getListPublishedOutputSchema)
  .query(({ input }) => listPublishedPostsByType(input.type, input.limit))
