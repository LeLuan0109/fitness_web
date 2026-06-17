import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shared/ui/tooltip"

export const DataTableCell = ({
  value
}: { value: string }) => {
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <div className="max-w-full cursor-pointer whitespace-break-spaces break-all line-clamp-2">
          {value}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">{value}</p>
      </TooltipContent>
    </Tooltip>
  )
}