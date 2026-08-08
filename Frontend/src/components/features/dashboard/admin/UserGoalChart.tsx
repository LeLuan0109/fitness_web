import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartResponse } from "@/types/dashboard.type"
import { Target } from "lucide-react"
import { memo } from "react"

interface UserGoalChartProps {
  data?: ChartResponse[]
}

const GOAL_COLORS = ["#2563eb", "#0ea5e9", "#14b8a6", "#8b5cf6", "#6366f1", "#64748b"]

export const UserGoalChart = memo(({ data }: UserGoalChartProps) => {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <Target className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="text-base font-semibold text-slate-950">Mục tiêu người dùng</CardTitle>
            <p className="mt-0.5 text-xs text-slate-500">Tỷ lệ theo mục tiêu tập luyện</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-4 pt-5 sm:px-5">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data || []}
              cx="50%"
              cy="50%"
              nameKey="label"
              dataKey="value"
              innerRadius={66}
              outerRadius={102}
              paddingAngle={3}
              cornerRadius={4}
              stroke="#ffffff"
              strokeWidth={2}
              label={({ value }) => `${value}%`}
              labelLine={false}
            >
              {(data || []).map((_, index) => (
                <Cell key={`cell-${index}`} fill={GOAL_COLORS[index % GOAL_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #dbeafe",
                borderRadius: 10,
                color: "#334155",
                fontSize: 13,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={10}
              formatter={(value) => <span style={{ color: "#475569", fontSize: 13 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

UserGoalChart.displayName = "UserGoalChart"
