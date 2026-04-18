"use client"

import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/core/trpc/client"

export function useViewerCapabilities() {
  const trpc = useTRPC()

  return useQuery(trpc.viewer.getCapabilities.queryOptions())
}
