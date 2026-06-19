import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartResponse } from "@/types/dashboard.type"
import { memo } from "react"

// Bộ màu hài hòa với theme (accent emerald + phái sinh), thay cho màu mặc định rời rạc.
const COLORS = ["#10b981", "#14b8a6", "#f59e0b", "#6366f1", "#f43f5e", "#0ea5e9"]

interface UserGoalChartProps {
  data?: ChartResponse[]
}

export const UserGoalChart = memo(({ data }: UserGoalChartProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Phân bố mục tiêu người dùng</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data || []}
              cx="50%"
              cy="50%"
              nameKey="label"
              dataKey="value"
              innerRadius={62}
              outerRadius={100}
              paddingAngle={2}
              stroke="none"
              label={({ value }) => `${value}%`}
              labelLine={false}
            >
              {(data || []).map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                color: "#111827",
                fontSize: 13,
                boxShadow: "0 4px 12px rgba(17, 24, 39, 0.08)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={10}
              formatter={(value) => <span style={{ color: "#374151", fontSize: 13 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

UserGoalChart.displayName = "UserGoalChart"
