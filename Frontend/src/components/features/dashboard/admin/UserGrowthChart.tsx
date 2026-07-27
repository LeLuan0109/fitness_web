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

const ACCENT = "#8c6239" // clay
const tickColor = "#4a3525" // earth
const gridColor = "rgba(140,98,57,0.12)" // clay transparent

export const UserGrowthChart = memo(({ data, currentYear, selectedYear, onYearChange }: UserGrowthChartProps) => {
  return (
    <Card className="col-span-1 border-sand/60 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-earth">Biểu đồ tăng trưởng người dùng</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedYear === currentYear - 1 ? "default" : "outline"}
              size="sm"
              className={selectedYear === currentYear - 1 ? "bg-clay text-cream hover:bg-earth" : "border-sand text-clay hover:bg-sand/30"}
              onClick={() => onYearChange(currentYear - 1)}
            >
              {currentYear - 1}
            </Button>
            <Button
              variant={selectedYear === currentYear ? "default" : "outline"}
              size="sm"
              className={selectedYear === currentYear ? "bg-clay text-cream hover:bg-earth" : "border-sand text-clay hover:bg-sand/30"}
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
                <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="label" stroke={tickColor} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={tickColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
            <Tooltip
              cursor={{ stroke: ACCENT, strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                background: "#fafafa",
                border: "1px solid #d9c3b0",
                borderRadius: 12,
                color: "#4a3525",
                fontSize: 13,
                boxShadow: "0 8px 24px rgba(74,53,37,0.12)",
              }}
              labelStyle={{ color: "#8c6239" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Số người dùng"
              stroke={ACCENT}
              strokeWidth={2.5}
              fill="url(#growthFill)"
              dot={false}
              activeDot={{ r: 5, fill: ACCENT, stroke: "#fafafa", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

UserGrowthChart.displayName = "UserGrowthChart"
