import { cache } from "react"
import { createTRPCContext } from "./context"
import { createTRPCCaller } from "./router"

export const getServerCaller = cache(async () => {
  const context = await createTRPCContext()

  return createTRPCCaller(context)
})
