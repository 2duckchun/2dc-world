import { publicProcedure } from "@/core/trpc/init"
import { getSessionOutputSchema } from "./schema"

export const getSessionProcedure = publicProcedure
  .output(getSessionOutputSchema)
  .query(({ ctx }) => ctx.session)
