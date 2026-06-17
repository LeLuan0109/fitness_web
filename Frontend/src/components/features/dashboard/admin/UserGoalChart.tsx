import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { ChartResponse } from "@/types/dashboard.type"
import { memo } from "react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

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
              labelLine={true}
              label={({ label, value }) => `${label}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {(data || []).map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

UserGoalChart.displayName = "UserGoalChart"
