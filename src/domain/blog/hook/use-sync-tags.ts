"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/core/trpc/client"

export function useSyncTags() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.blog.postSyncTags.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: trpc.blog.pathKey() })
      },
    }),
  )
}
