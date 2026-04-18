"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/core/trpc/client"

export function useCreateSeries() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.blog.postCreateSeries.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.blog.getSeriesList.queryFilter(),
        )
      },
    }),
  )
}
