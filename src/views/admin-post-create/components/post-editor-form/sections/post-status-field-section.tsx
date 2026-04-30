import { PostKindRadioField } from "../shared/fields/post-kind-radio-field"
import { PostSeriesFields } from "../shared/fields/post-series-fields"
import { PostSlugInputField } from "../shared/fields/post-slug-input-field"
import { PostStatusSelectField } from "../shared/fields/post-status-select-field"
import { PostSubtitleInputField } from "../shared/fields/post-subtitle-input-field"
import { PostTagsInputField } from "../shared/fields/post-tags-input-field"
import { PostThumbnailInputField } from "../shared/fields/post-thumbnail-input-field"
import { PostTitleInputField } from "../shared/fields/post-title-input-field"

type SeriesOption = {
  id: string
  title: string
}

type PostStatusFieldSectionsProps = {
  seriesOptions: SeriesOption[]
}

export const PostStatusFieldSections = ({
  seriesOptions,
}: PostStatusFieldSectionsProps) => {
  return (
    <section className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <PostTitleInputField />
        <PostStatusSelectField />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <PostSlugInputField />
        <PostSubtitleInputField />
      </div>

      <PostThumbnailInputField />
      <PostTagsInputField />
      <PostKindRadioField />
      <PostSeriesFields seriesOptions={seriesOptions} />
    </section>
  )
}
