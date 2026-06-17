import { Link } from "react-router-dom"
import { CalendarDays, Utensils, Flame, BarChart } from "lucide-react"
import { Card, CardContent } from "@/components/shared/ui/card"
import { Badge } from "@/components/shared/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/shared/ui/scroll-area"
import { ROUTES } from "@/constants/routes"

type Props = {
  type: "MENU_LIST" | "PLAN_LIST"
  items: any[]
}

export const ChatSuggestionList = ({ type, items }: Props) => {
  if (!items || items.length === 0) return null

  const getLink = (item: any) => {
    if (type === "MENU_LIST") {
      return ROUTES.NUTRITION.SAMPLE_DETAIL.replace(":id", item.id)
    }
    if (type === "PLAN_LIST") {
      return ROUTES.WORKOUTS.DETAIL.replace(":id", item.id)
    }
    return "#"
  }

  return (
    // FIX: Thêm max-w-[300px] để ép ScrollArea hoạt động trong phạm vi ô chat 400px
    // Thêm overflow-hidden để tránh layout shift
    <div className="w-full mt-3 max-w-[300px] overflow-hidden">
      <div className="mb-2 px-1 text-xs font-medium text-muted-foreground/80 flex items-center gap-2">
        <span className="h-px flex-1 bg-border"></span>
        <span>Gợi ý phù hợp</span>
        <span className="h-px flex-1 bg-border"></span>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap rounded-md pb-2">
        <div className="flex w-max space-x-3 p-1">
          {items.map((item) => (
            <Link
              key={item.id}
              to={getLink(item)}
              className="block group"
            >
              <Card className="w-[180px] overflow-hidden hover:shadow-md transition-all border-muted group-hover:border-primary/50">
                {type === "MENU_LIST" && (
                  <>
                    <div className="aspect-video w-full relative bg-muted overflow-hidden">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.calories && (
                        <div className="absolute bottom-1 right-1">
                          <Badge variant="secondary" className="text-[10px] px-1 h-5 bg-black/60 text-white backdrop-blur-sm border-none">
                            <Flame className="size-3 mr-0.5 text-orange-400" fill="currentColor" />
                            {Math.round(item.calories)}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-2.5">
                      <h4 className="font-semibold text-xs truncate mb-1" title={item.name}>
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Utensils className="size-3" />
                        <span className="capitalize">{item.fitnessGoal?.replace(/_/g, " ").toLowerCase()}</span>
                      </div>
                    </CardContent>
                  </>
                )}

                {type === "PLAN_LIST" && (
                  <>
                    <div className="h-20 bg-primary/5 flex flex-col items-center justify-center p-3 text-center relative group-hover:bg-primary/10 transition-colors">
                      <CalendarDays className="size-6 text-primary/60 mb-1" />
                      <h4 className="font-bold text-xs line-clamp-2 text-primary whitespace-normal leading-snug w-full">
                        {item.name}
                      </h4>
                    </div>
                    <CardContent className="p-2.5 bg-card">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <Badge variant="outline" className="text-[10px] h-5 px-1 font-normal border-primary/20 text-primary">
                          {item.difficultyLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BarChart className="size-3" />
                          <span>{item.durationWeek} tuần</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{item.daysPerWeek} buổi/tuần</span>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2.5" />
      </ScrollArea>
    </div>
  )
}