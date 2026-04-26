import { baseProcedure } from "../init"
import { loggerMiddleware } from "../middleware/logger-middleware"

export const publicProcedure = baseProcedure.use(loggerMiddleware)
