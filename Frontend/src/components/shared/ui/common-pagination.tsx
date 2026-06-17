import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shared/ui/pagination"
import { cn } from "@/lib/utils"

interface CommonPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showInfo?: boolean
  pageSize?: number
  total?: number
}

export const CommonPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showInfo = true,
  pageSize = 10,
  total = 0,
}: CommonPaginationProps) => {
  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages)
      }
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index)
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={cn("cursor-pointer", currentPage <= 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>

            {/* Page numbers */}
            {getPageNumbers().map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => onPageChange(Number(pageNumber))}
                    isActive={currentPage === pageNumber}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={cn("cursor-pointer", currentPage >= totalPages && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Results info */}
      {showInfo && total > 0 && (
        <div className="flex justify-center text-sm text-muted-foreground">
          Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, total)} trong tổng số {total}{" "}
          kết quả
        </div>
      )}
    </div>
  )
}
