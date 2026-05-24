"use client"

import type { MouseEvent } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination"

type HomePaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

type PageWindowItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; key: string }

const buildPageWindow = (
  currentPage: number,
  totalPages: number,
): PageWindowItem[] => {
  const pageSet = new Set<number>()
  pageSet.add(1)
  pageSet.add(totalPages)
  for (let offset = -1; offset <= 1; offset += 1) {
    const candidate = currentPage + offset
    if (candidate >= 1 && candidate <= totalPages) {
      pageSet.add(candidate)
    }
  }

  const sortedPages = [...pageSet].sort(
    (firstPage, secondPage) => firstPage - secondPage,
  )
  const items: PageWindowItem[] = []
  let previousPage: number | null = null
  for (const pageNumber of sortedPages) {
    if (previousPage !== null && pageNumber - previousPage > 1) {
      items.push({
        type: "ellipsis",
        key: `ellipsis-${previousPage}-${pageNumber}`,
      })
    }
    items.push({ type: "page", page: pageNumber })
    previousPage = pageNumber
  }
  return items
}

export function HomePagination({
  currentPage,
  totalPages,
  onPageChange,
}: HomePaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pageWindow = buildPageWindow(currentPage, totalPages)
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  const handleNavigate =
    (target: number) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      if (target < 1 || target > totalPages || target === currentPage) {
        return
      }
      onPageChange(target)
    }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text="이전"
            aria-disabled={isFirstPage}
            tabIndex={isFirstPage ? -1 : undefined}
            className={
              isFirstPage ? "pointer-events-none opacity-50" : undefined
            }
            onClick={handleNavigate(currentPage - 1)}
          />
        </PaginationItem>
        {pageWindow.map((item) =>
          item.type === "ellipsis" ? (
            <PaginationItem key={item.key}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item.page}>
              <PaginationLink
                href="#"
                isActive={item.page === currentPage}
                aria-current={item.page === currentPage ? "page" : undefined}
                onClick={handleNavigate(item.page)}
              >
                {item.page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            text="다음"
            aria-disabled={isLastPage}
            tabIndex={isLastPage ? -1 : undefined}
            className={
              isLastPage ? "pointer-events-none opacity-50" : undefined
            }
            onClick={handleNavigate(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
