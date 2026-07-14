import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shared/ui/chart"
import { ChartDataPoint } from "@/types/history.type"

interface HistoryChartProps {
  title: string
  data: ChartDataPoint[]
}

export function HistoryChart({ title, data }: HistoryChartProps) {
  const chartConfig = {
    value: {
      label: title,
      color: "#8c6239",
    },
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-earth text-base font-medium">{title}</h3>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,53,37,0.12)" />
          <XAxis
            dataKey="date"
            stroke="#8c6239"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#8c6239"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-history-chart-bar)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
