import { publicProcedure } from "@/core/trpc/init"
import { getCapabilitiesOutputSchema } from "./schema"

export const getCapabilitiesProcedure = publicProcedure
  .output(getCapabilitiesOutputSchema)
  .query(({ ctx }) => ctx.capabilities)
