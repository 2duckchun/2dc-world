import { baseProcedure } from "../init"
import { adminMiddleware } from "../middleware/admin-middleware"
import { loggerMiddleware } from "../middleware/logger-middleware"

export const adminProcedure = baseProcedure
  .use(loggerMiddleware)
  .use(adminMiddleware)
