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

export const UserGrowthChart = memo(({ data, currentYear, selectedYear, onYearChange }: UserGrowthChartProps) => {
  const [palette, setPalette] = useState<string[]>(() => getEarthPalette())
  
  useEffect(() => {
    const updatePalette = () => {
      setPalette(getEarthPalette())
    }
    
    const observer = new MutationObserver(updatePalette)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    
    return () => observer.disconnect()
  }, [])

  const accentColor = palette[2] // clay
  const tickColorValue = palette[0] // earth-dark
  const sandColor = palette[5] // sand

  return (
    <Card className="col-span-1 border-sand/60 shadow-sm">
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
                border: `1px solid ${sandColor}`,
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
