import { baseProcedure } from "../init"
import { authMiddleware } from "../middleware/auth-middleware"
import { loggerMiddleware } from "../middleware/logger-middleware"

export const authProcedure = baseProcedure
  .use(loggerMiddleware)
  .use(authMiddleware)
