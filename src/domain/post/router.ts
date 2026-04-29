import { createTRPCRouter } from "@/core/trpc/base/init"
import { postGetForEditProcedure } from "./procedure/get-for-edit"
import { getLatestPostsProcedure } from "./procedure/get-latest-posts"
import { postListForAdminProcedure } from "./procedure/get-list-for-admin"
import { postArchivePostProcedure } from "./procedure/post-archive-post"
import { postCreatePostProcedure } from "./procedure/post-create-post"
import { postUpdatePostProcedure } from "./procedure/post-update-post"

export const postRouter = createTRPCRouter({
  archive: postArchivePostProcedure,
  create: postCreatePostProcedure,
  getForEdit: postGetForEditProcedure,
  getLatestPosts: getLatestPostsProcedure,
  listForAdmin: postListForAdminProcedure,
  update: postUpdatePostProcedure,
})
