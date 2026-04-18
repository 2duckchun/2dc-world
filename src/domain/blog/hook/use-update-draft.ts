"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/core/trpc/client"

export function useUpdateDraft() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.blog.postUpdateDraft.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.blog.getDraftList.queryFilter()),
          queryClient.invalidateQueries({ queryKey: trpc.blog.pathKey() }),
        ])
      },
    }),
  )
}
