import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Button } from "@/components/shared/ui/button"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartResponse } from "@/types/dashboard.type"
import { memo, useEffect, useState } from "react"

interface UserGrowthChartProps {
  data?: ChartResponse[]
  currentYear: number
  selectedYear: number
  onYearChange: (year: number) => void
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

export const UserGrowthChart = memo(({ data, currentYear, selectedYear, onYearChange }: UserGrowthChartProps) => {
  const [palette, setPalette] = useState<string[]>(() => getDesignaliPalette())
  
  useEffect(() => {
    const updatePalette = () => {
      setPalette(getDesignaliPalette())
    }
    
    const observer = new MutationObserver(updatePalette)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    
    return () => observer.disconnect()
  }, [])

  const accentColor = palette[0] // brand-violet
  const tickColorValue = "#737373" // muted-foreground
  const borderColor = "#e5e5e5" // border

  const isActiveBtn = (year: number) => selectedYear === year

  return (
    <Card className="col-span-1 border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-foreground">Biểu đồ tăng trưởng người dùng</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={isActiveBtn(currentYear - 1) ? "default" : "outline"}
              size="sm"
              className={isActiveBtn(currentYear - 1) ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-border text-foreground hover:bg-muted"}
              onClick={() => onYearChange(currentYear - 1)}
            >
              {currentYear - 1}
            </Button>
            <Button
              variant={isActiveBtn(currentYear) ? "default" : "outline"}
              size="sm"
              className={isActiveBtn(currentYear) ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-border text-foreground hover:bg-muted"}
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
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={`${tickColorValue}1f`}
              vertical={false} 
            />
            <XAxis 
              dataKey="label" 
              stroke={tickColorValue}
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke={tickColorValue}
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false} 
              width={40} 
            />
            <Tooltip
              cursor={{ stroke: accentColor, strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                background: "var(--card)",
                border: `1px solid ${borderColor}`,
                borderRadius: 12,
                color: tickColorValue,
                fontSize: 13,
                boxShadow: `0 8px 24px ${tickColorValue}1f`,
              }}
              labelStyle={{ color: accentColor }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Số người dùng"
              stroke={accentColor}
              strokeWidth={2.5}
              fill="url(#growthFill)"
              dot={false}
              activeDot={{ r: 5, fill: accentColor, stroke: "var(--card)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

UserGrowthChart.displayName = "UserGrowthChart"
