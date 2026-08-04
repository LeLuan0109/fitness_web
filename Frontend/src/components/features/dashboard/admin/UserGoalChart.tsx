import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartResponse } from "@/types/dashboard.type"
import { memo, useEffect, useState } from "react"

interface UserGoalChartProps {
  data?: ChartResponse[]
}

/** Get Designali palette colors from CSS variables (responsive to light/dark mode) */
function getDesignaliPalette(): string[] {
  if (typeof document === "undefined") {
    return ["#0ea5e9", "#0284c7", "#0369a1", "#0c4a6e", "#075985", "#f97316"]
  }
  const root = document.documentElement
  const style = getComputedStyle(root)
  return [
    style.getPropertyValue("--color-designali-brand-violet").trim() || "#0ea5e9",
    style.getPropertyValue("--color-designali-indigo-deep").trim() || "#0284c7",
    style.getPropertyValue("--color-designali-action-blue").trim() || "#0369a1",
    style.getPropertyValue("--color-designali-app-orange").trim() || "#f97316",
    style.getPropertyValue("--color-designali-app-pink").trim() || "#ec4899",
    style.getPropertyValue("--color-designali-destructive-red").trim() || "#ef4444",
  ]
}

export const UserGoalChart = memo(({ data }: UserGoalChartProps) => {
  const [palette, setPalette] = useState<string[]>(() => getDesignaliPalette())
  
  useEffect(() => {
    const updatePalette = () => {
      setPalette(getDesignaliPalette())
    }
    
    const observer = new MutationObserver(updatePalette)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    
    return () => observer.disconnect()
  }, [])

  const foregroundColor = "#0a0a0a" // foreground
  const borderColor = "#e5e5e5" // border
  
  return (
    <Card className="col-span-1 border-[#e5e5e5] shadow-sm dark:border-[#404040]">
      <CardHeader>
        <CardTitle className="font-display text-[#171717] dark:text-[#fafafa]">Phân bố mục tiêu người dùng</CardTitle>
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
                border: `1px solid ${borderColor}`,
                borderRadius: 12,
                color: foregroundColor,
                fontSize: 13,
                boxShadow: `0 8px 24px ${foregroundColor}1f`,
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={10}
              formatter={(value) => <span style={{ color: foregroundColor, fontSize: 13 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

UserGoalChart.displayName = "UserGoalChart"
