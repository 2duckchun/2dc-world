import type { PostSyncTagsInput, PostSyncTagsOutput } from "./schema"

export const postSyncTagsInputFixture: PostSyncTagsInput = {
  postId: "post-1",
  tagNames: ["nextjs", "react"],
}

export const postSyncTagsOutputFixture: PostSyncTagsOutput = {
  postId: "post-1",
  tagNames: ["nextjs", "react"],
}
