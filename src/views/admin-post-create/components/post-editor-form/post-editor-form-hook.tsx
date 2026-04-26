"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import { sanitizeSlugInput } from "@/domain/content/slug"
import {
  type PostCreatePostInput,
  postCreatePostInputSchema,
} from "@/domain/post/procedure/post-create-post/schema"

const defaultMarkdown = `# 제목

본문을 작성하세요.
`

export function usePostEditorForm() {
  const router = useRouter()
  const trpc = useTRPC()
  const form = useForm<PostCreatePostInput>({
    resolver: zodResolver(postCreatePostInputSchema),
    defaultValues: {
      title: "",
      slug: "",
      subtitle: null,
      thumbnail: null,
      content: defaultMarkdown,
      kind: "post",
      status: "draft",
      seriesId: null,
      seriesOrder: null,
    },
  })
  const selectedKind = form.watch("kind")
  const isSeriesKind = selectedKind === "series"
  const createPost = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: () => {
        toast.success("게시글을 저장했습니다.")
        router.push("/")
      },
      onError: (error) => {
        const message =
          error.message || "게시글 저장에 실패했습니다. 다시 시도해 주세요."

        form.setError("root", { type: "server", message })

        if (message.includes("슬러그")) {
          form.setError("slug", { type: "server", message })
        }

        toast.error(message)
      },
    }),
  )

  useEffect(() => {
    if (isSeriesKind) {
      return
    }

    form.setValue("seriesId", null)
    form.setValue("seriesOrder", null)
    form.clearErrors(["seriesId", "seriesOrder"])
  }, [form, isSeriesKind])

  return {
    form,
    isPending: createPost.isPending,
    isSeriesKind,
    rootError: form.formState.errors.root?.message,
    handleNullableTextChange: (value: string) => value || null,
    handleSeriesOrderChange: (value: string) => (value ? Number(value) : null),
    handleSlugChange: sanitizeSlugInput,
    handleSubmit: form.handleSubmit((values) => {
      form.clearErrors("root")
      createPost.mutate(values)
    }),
  }
}
