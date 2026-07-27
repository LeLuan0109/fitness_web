import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartResponse } from "@/types/dashboard.type"
import { memo } from "react"

interface UserGoalChartProps {
  data?: ChartResponse[]
}

/** Earth/clay palette: dark → light warm browns */
const PALETTE = [
  "#4a3525", // earth
  "#6b4c35", // mid-earth
  "#8c6239", // clay
  "#a87c55", // clay-light
  "#c49a72", // sand-dark
  "#d9c3b0", // sand
]

export const UserGoalChart = memo(({ data }: UserGoalChartProps) => {
  return (
    <Card className="col-span-1 border-sand/60 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-earth">Phân bố mục tiêu người dùng</CardTitle>
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
                <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                background: "#fafafa",
                border: "1px solid #d9c3b0",
                borderRadius: 12,
                color: "#4a3525",
                fontSize: 13,
                boxShadow: "0 8px 24px rgba(74,53,37,0.12)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={10}
              formatter={(value) => <span style={{ color: "#4a3525", fontSize: 13 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

UserGoalChart.displayName = "UserGoalChart"
