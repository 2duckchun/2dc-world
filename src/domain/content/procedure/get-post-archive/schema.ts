import type { inferRouterOutputs } from "@trpc/server"
import { z } from "zod"
import type { AppRouter } from "@/core/trpc/router"

const postArchiveTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
})

const postArchivePostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  subtitle: z.string().nullable(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  postTags: z.array(
    z.object({
      tag: postArchiveTagSchema,
    }),
  ),
})

export const contentGetPostArchiveInputSchema = z.void()

export const contentGetPostArchiveOutputSchema = z.array(postArchivePostSchema)

export type ContentGetPostArchiveOutput = z.output<
  typeof contentGetPostArchiveOutputSchema
>

export type PostArchiveData =
  inferRouterOutputs<AppRouter>["content"]["getPostArchive"]
