import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublishedTagArchive } from "@/domain/blog/server/public-readers"
import { TagPostsView } from "@/views/tag-posts"

type TagArchivePageProps = {
  params: Promise<{ tag_name: string }>
}

export async function generateMetadata({
  params,
}: TagArchivePageProps): Promise<Metadata> {
  const { tag_name: tagName } = await params
  const archive = await getPublishedTagArchive(tagName)

  if (!archive) {
    return {
      title: "Tag not found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title: `#${archive.tagName}`,
    description: `Published posts tagged with ${archive.tagName}.`,
  }
}

export default async function TagArchivePage({ params }: TagArchivePageProps) {
  const { tag_name: tagName } = await params
  const archive = await getPublishedTagArchive(tagName)

  if (!archive) {
    notFound()
  }

  return <TagPostsView tagName={archive.tagName} posts={archive.posts} />
}
