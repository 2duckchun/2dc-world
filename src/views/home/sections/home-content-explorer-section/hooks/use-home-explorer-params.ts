"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import type { HomeContentTab } from "@/views/home/sections/home-content-explorer-section/components/home-content-explorer"

const HOME_CONTENT_TABS = ["all", "post", "log", "series"] as const

const isHomeContentTab = (value: string | null): value is HomeContentTab =>
  value !== null && (HOME_CONTENT_TABS as readonly string[]).includes(value)

const parseTab = (value: string | null): HomeContentTab =>
  isHomeContentTab(value) ? value : "all"

const parsePage = (value: string | null): number => {
  if (value === null) {
    return 1
  }
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1
  }
  return parsed
}

type ParamUpdates = {
  tab?: HomeContentTab
  tagSlug?: string | null
  page?: number
}

export type HomeExplorerParams = {
  tab: HomeContentTab
  tagSlug: string | null
  page: number
  setTab: (tab: HomeContentTab) => void
  setTagSlug: (tagSlug: string | null) => void
  setPage: (page: number) => void
}

export function useHomeExplorerParams(): HomeExplorerParams {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tab = parseTab(searchParams.get("tab"))
  const tagSlug = searchParams.get("tag")
  const page = parsePage(searchParams.get("page"))

  const updateParams = useCallback(
    (updates: ParamUpdates) => {
      const nextParams = new URLSearchParams(searchParams.toString())

      if ("tab" in updates) {
        if (updates.tab === undefined || updates.tab === "all") {
          nextParams.delete("tab")
        } else {
          nextParams.set("tab", updates.tab)
        }
      }
      if ("tagSlug" in updates) {
        if (updates.tagSlug === undefined || updates.tagSlug === null) {
          nextParams.delete("tag")
        } else {
          nextParams.set("tag", updates.tagSlug)
        }
      }
      if ("page" in updates) {
        if (updates.page === undefined || updates.page <= 1) {
          nextParams.delete("page")
        } else {
          nextParams.set("page", String(updates.page))
        }
      }

      const queryString = nextParams.toString()
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.replace(nextUrl, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const setTab = useCallback(
    (nextTab: HomeContentTab) => {
      updateParams({ tab: nextTab, tagSlug: null, page: 1 })
    },
    [updateParams],
  )

  const setTagSlug = useCallback(
    (nextTagSlug: string | null) => {
      updateParams({ tagSlug: nextTagSlug, page: 1 })
    },
    [updateParams],
  )

  const setPage = useCallback(
    (nextPage: number) => {
      updateParams({ page: nextPage })
    },
    [updateParams],
  )

  return {
    tab,
    tagSlug,
    page,
    setTab,
    setTagSlug,
    setPage,
  }
}
