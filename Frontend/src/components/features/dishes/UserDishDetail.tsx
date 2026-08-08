import { ImageWithFallback } from "@/components/shared/common/image-with-fallbacks"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent } from "@/components/shared/ui/card"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { MacroCard } from "@/components/features/nutrition/MacroCard"
import { useDishDetail } from "@/hooks/queries/dishes/useDishDetail"
import { ArrowLeft, Beef, Droplet, Flame, Loader2, Wheat } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { IngredientItem } from "./IngredientItem"

export function UserDishDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useDishDetail(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-clay">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <Card className="border-sand/60 bg-white text-earth shadow-sm shadow-earth/5">
        <CardContent className="py-12 text-center">
          <p className="text-earth/65">Không tìm thấy thông tin món ăn</p>
          <Button className="mt-4 bg-earth text-cream hover:bg-clay" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 size-4" /> Quay lại
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 text-earth">
      <Button
        variant="ghost"
        className="text-earth hover:bg-sand/40 hover:text-clay"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 size-4" /> Quay lại
      </Button>
      <TypographyH3 variant="bold">Chi tiết món ăn</TypographyH3>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full overflow-hidden rounded-2xl border-sand/60 bg-white p-0 shadow-sm shadow-earth/5">
            <div className="relative h-full min-h-[500px]">
              <ImageWithFallback src={data.image} alt={data.name} className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-earth/85 via-earth/35 to-transparent" />
              <div className="absolute inset-x-6 bottom-6">
                <h1 className="text-2xl font-bold text-cream">{data.name}</h1>
                <div className="mt-2 text-cream/80">{data.cookingTime} phút</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Card className="rounded-2xl border-sand/60 bg-white shadow-sm shadow-earth/5">
            <CardContent>
              <h3 className="mb-4 font-display text-lg font-medium text-earth">Giá trị dinh dưỡng</h3>
              <div className="flex flex-wrap gap-3">
                <MacroCard label="Calories" value={`${data.calories}`} Icon={Flame} />
                <MacroCard label="Protein" value={`${data.protein}g`} Icon={Beef} />
                <MacroCard label="Carbs" value={`${data.carbs}g`} Icon={Wheat} />
                <MacroCard label="Fat" value={`${data.fat}g`} Icon={Droplet} />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-sand/60 bg-white shadow-sm shadow-earth/5">
            <CardContent>
              <h3 className="mb-4 font-display text-lg font-medium text-earth">Nguyên liệu</h3>
              <div className="space-y-3">
                {data.ingredients.map((ingredient) => (
                  <IngredientItem key={ingredient.id} item={ingredient} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-2xl border-sand/60 bg-white shadow-sm shadow-earth/5">
        <CardContent>
          <h3 className="mb-4 font-display text-lg font-medium text-earth">Cách chế biến</h3>
          <div className="space-y-3 text-earth/80">
            {String(data.preparation)
              .split(/\n|\r\n/)
              .map((step) => step.trim())
              .filter(Boolean)
              .map((step, index) => (
                <div key={index}>{step}</div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
