import type { inferRouterOutputs } from "@trpc/server"
import { z } from "zod"
import type { AppRouter } from "@/core/trpc/router"

const logArchiveTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
})

const logArchivePostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  subtitle: z.string().nullable(),
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  postTags: z.array(
    z.object({
      tag: logArchiveTagSchema,
    }),
  ),
})

export const contentGetLogArchiveInputSchema = z.void()

export const contentGetLogArchiveOutputSchema = z.array(logArchivePostSchema)

export type ContentGetLogArchiveOutput = z.output<
  typeof contentGetLogArchiveOutputSchema
>

export type LogArchiveData =
  inferRouterOutputs<AppRouter>["content"]["getLogArchive"]
