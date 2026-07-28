import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartResponse } from "@/types/dashboard.type"
import { memo, useEffect, useState } from "react"

interface UserGoalChartProps {
  data?: ChartResponse[]
}

/** Get earth palette colors from CSS variables (responsive to light/dark mode) */
function getEarthPalette(): string[] {
  if (typeof document === "undefined") {
    return ["#4a3525", "#6b4c35", "#8c6239", "#a87c55", "#c49a72", "#d9c3b0"]
  }
  const root = document.documentElement
  const style = getComputedStyle(root)
  return [
    style.getPropertyValue("--earth-dark").trim(),
    style.getPropertyValue("--earth-mid").trim(),
    style.getPropertyValue("--clay").trim(),
    style.getPropertyValue("--clay-light").trim(),
    style.getPropertyValue("--sand-dark").trim(),
    style.getPropertyValue("--sand").trim(),
  ]
}

export const UserGoalChart = memo(({ data }: UserGoalChartProps) => {
  const [palette, setPalette] = useState<string[]>(() => getEarthPalette())
  
  useEffect(() => {
    const updatePalette = () => {
      setPalette(getEarthPalette())
    }
    
    const observer = new MutationObserver(updatePalette)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    
    return () => observer.disconnect()
  }, [])

  const earthColor = palette[0]
  const sandColor = palette[5]
  
  return (
    <Card className="col-span-1 border-sand/60 shadow-sm">
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
                <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                background: "var(--card)",
                border: `1px solid ${sandColor}`,
                borderRadius: 12,
                color: earthColor,
                fontSize: 13,
                boxShadow: `0 8px 24px ${earthColor}1f`,
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={10}
              formatter={(value) => <span style={{ color: earthColor, fontSize: 13 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

UserGoalChart.displayName = "UserGoalChart"
