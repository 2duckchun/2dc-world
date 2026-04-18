import type { GetSessionOutput } from "./schema"

export const getSessionFixture: GetSessionOutput = {
  role: "anonymous",
  isAuthenticated: false,
  isOwner: false,
  user: null,
}
