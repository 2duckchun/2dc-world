import { createTRPCMiddleware } from "../init"

export const loggerMiddleware = createTRPCMiddleware(
  async ({ next, path, type }) => {
    const startedAt = Date.now()
    let error: unknown

    try {
      return await next()
    } catch (cause) {
      error = cause
      throw error
    } finally {
      if (process.env.NODE_ENV === "development") {
        const duration = Date.now() - startedAt
        const status = error ? "failed" : "ok"
        const message = `[tRPC] ${type} ${path} ${status} ${duration}ms`

        if (error) {
          console.error(message, error)
        } else {
          console.log(message)
        }
      }
    }
  },
)
