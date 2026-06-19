import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Button } from "@/components/shared/ui/button"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartResponse } from "@/types/dashboard.type"
import { memo } from "react"

interface UserGrowthChartProps {
  data?: ChartResponse[]
  currentYear: number
  selectedYear: number
  onYearChange: (year: number) => void
}

export const UserGrowthChart = memo(({ data, currentYear, selectedYear, onYearChange }: UserGrowthChartProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Biểu đồ tăng trưởng người dùng</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedYear === currentYear - 1 ? "default" : "outline"}
              size="sm"
              onClick={() => onYearChange(currentYear - 1)}
            >
              {currentYear - 1}
            </Button>
            <Button
              variant={selectedYear === currentYear ? "default" : "outline"}
              size="sm"
              onClick={() => onYearChange(currentYear)}
            >
              {currentYear}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data || []} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="label" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
            <Tooltip
              cursor={{ stroke: "#10b981", strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                color: "#111827",
                fontSize: 13,
                boxShadow: "0 4px 12px rgba(17, 24, 39, 0.08)",
              }}
              labelStyle={{ color: "#6b7280" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Số người dùng"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#growthFill)"
              dot={false}
              activeDot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

UserGrowthChart.displayName = "UserGrowthChart"
