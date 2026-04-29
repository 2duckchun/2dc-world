"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTRPC } from "@/core/trpc/client/providers/trpc-tanstack-query-provider"
import {
  type PostCreatePostInput,
  postCreatePostInputSchema,
} from "@/domain/post/procedure/post-create-post/schema"

const defaultMarkdown = `# 제목

본문을 작성하세요.
`

export const defaultPostEditorValues = {
  title: "",
  slug: "",
  subtitle: null,
  thumbnail: null,
  content: defaultMarkdown,
  kind: "post",
  status: "draft",
  seriesId: null,
  seriesOrder: null,
  tags: [],
} satisfies PostCreatePostInput

type UsePostEditorFormProps = {
  mode: "create" | "edit"
  initialValues: PostCreatePostInput
  postId?: string
}

const setServerError = (
  form: UseFormReturn<PostCreatePostInput>,
  message: string,
) => {
  form.setError("root", { type: "server", message })

  if (message.includes("슬러그")) {
    form.setError("slug", { type: "server", message })
  }

  if (message.includes("시리즈 순서")) {
    form.setError("seriesOrder", { type: "server", message })
  }
}

export function usePostEditorForm({
  mode,
  initialValues,
  postId,
}: UsePostEditorFormProps) {
  const router = useRouter()
  const trpc = useTRPC()
  const form = useForm<PostCreatePostInput>({
    resolver: zodResolver(postCreatePostInputSchema),
    defaultValues: initialValues,
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

        setServerError(form, message)
        toast.error(message)
      },
    }),
  )
  const updatePost = useMutation(
    trpc.post.update.mutationOptions({
      onSuccess: () => {
        toast.success("게시글을 수정했습니다.")
        router.push("/admin/posts")
      },
      onError: (error) => {
        const message =
          error.message || "게시글 수정에 실패했습니다. 다시 시도해 주세요."

        setServerError(form, message)
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
    isPending: createPost.isPending || updatePost.isPending,
    rootError: form.formState.errors.root?.message,
    handleSubmit: form.handleSubmit((values) => {
      form.clearErrors("root")

      if (mode === "edit" && postId) {
        updatePost.mutate({ id: postId, ...values })
        return
      }

      createPost.mutate(values)
    }),
  }
}
