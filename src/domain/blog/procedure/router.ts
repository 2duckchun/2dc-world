import { createTRPCRouter } from "@/core/trpc/init"
import { getBySlugProcedure } from "./get_by_slug"
import { getByTagProcedure } from "./get_by_tag"
import { getDraftListProcedure } from "./get_draft_list"
import { getEditablePostProcedure } from "./get_editable_post"
import { getListPublishedProcedure } from "./get_list_published"
import { getSeriesBySlugProcedure } from "./get_series_by_slug"
import { getSeriesListProcedure } from "./get_series_list"
import { postCreateDraftProcedure } from "./post_create_draft"
import { postCreateSeriesProcedure } from "./post_create_series"
import { postPublishProcedure } from "./post_publish"
import { postSyncTagsProcedure } from "./post_sync_tags"
import { postUpdateDraftProcedure } from "./post_update_draft"

export const blogRouter = createTRPCRouter({
  getBySlug: getBySlugProcedure,
  getByTag: getByTagProcedure,
  getDraftList: getDraftListProcedure,
  getEditablePost: getEditablePostProcedure,
  getListPublished: getListPublishedProcedure,
  getSeriesBySlug: getSeriesBySlugProcedure,
  getSeriesList: getSeriesListProcedure,
  postCreateDraft: postCreateDraftProcedure,
  postCreateSeries: postCreateSeriesProcedure,
  postPublish: postPublishProcedure,
  postSyncTags: postSyncTagsProcedure,
  postUpdateDraft: postUpdateDraftProcedure,
})
