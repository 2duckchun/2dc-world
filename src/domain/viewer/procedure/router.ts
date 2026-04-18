import { createTRPCRouter } from "@/core/trpc/init"
import { getCapabilitiesProcedure } from "./get-capabilities"
import { getSessionProcedure } from "./get-session"

export const viewerRouter = createTRPCRouter({
  getSession: getSessionProcedure,
  getCapabilities: getCapabilitiesProcedure,
})
