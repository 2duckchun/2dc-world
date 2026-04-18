"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/core/trpc/client"

export function usePublish() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.blog.postPublish.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.blog.getDraftList.queryFilter()),
          queryClient.invalidateQueries({ queryKey: trpc.blog.pathKey() }),
        ])
      },
    }),
  )
}
