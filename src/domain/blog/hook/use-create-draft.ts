"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/core/trpc/client"

export function useCreateDraft() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.blog.postCreateDraft.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.blog.getDraftList.queryFilter(),
        )
      },
    }),
  )
}
