import type { PostArchivePostInput, PostArchivePostOutput } from "./schema"

export const postArchivePostInputFixture = {
  id: "post_fixture_1",
} satisfies PostArchivePostInput

export const postArchivePostOutputFixture = {
  id: "post_fixture_1",
  status: "archived",
} satisfies PostArchivePostOutput
