import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Button } from "@/components/shared/ui/button"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartResponse } from "@/types/dashboard.type"
import { TrendingUp } from "lucide-react"
import { memo } from "react"

interface UserGrowthChartProps {
  data?: ChartResponse[]
  currentYear: number
  selectedYear: number
  onYearChange: (year: number) => void
}

export const UserGrowthChart = memo(({ data, currentYear, selectedYear, onYearChange }: UserGrowthChartProps) => {
  const isActiveBtn = (year: number) => selectedYear === year

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-base font-semibold text-slate-950">Tăng trưởng người dùng</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">Số tài khoản mới theo tháng</p>
            </div>
          </div>
          <div className="flex w-fit rounded-lg bg-slate-100 p-1">
            <Button
              variant="ghost"
              size="sm"
              className={isActiveBtn(currentYear - 1) ? "h-8 rounded-md bg-white px-3 text-blue-700 shadow-sm hover:bg-white" : "h-8 rounded-md px-3 text-slate-500 hover:bg-white/70"}
              onClick={() => onYearChange(currentYear - 1)}
            >
              {currentYear - 1}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={isActiveBtn(currentYear) ? "h-8 rounded-md bg-white px-3 text-blue-700 shadow-sm hover:bg-white" : "h-8 rounded-md px-3 text-slate-500 hover:bg-white/70"}
              onClick={() => onYearChange(currentYear)}
            >
              {currentYear}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-4 pt-5 sm:px-5">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data || []} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0"
              vertical={false} 
            />
            <XAxis 
              dataKey="label" 
              stroke="#64748b"
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false} 
              width={40} 
            />
            <Tooltip
              cursor={{ stroke: "#2563eb", strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #dbeafe",
                borderRadius: 10,
                color: "#334155",
                fontSize: 13,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
              labelStyle={{ color: "#1d4ed8", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Số người dùng"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#growthFill)"
              dot={false}
              activeDot={{ r: 5, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

UserGrowthChart.displayName = "UserGrowthChart"
