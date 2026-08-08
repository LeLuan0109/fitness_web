import { MacroCard } from "@/components/features/nutrition/MacroCard"
import { ImageWithFallback } from "@/components/shared/common/image-with-fallbacks"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent } from "@/components/shared/ui/card"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { ScrollArea } from "@/components/shared/ui/scroll-area"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { Textarea } from "@/components/shared/ui/textarea"
import { useGetFitnessGoalOptions } from "@/hooks/queries/common/useGetFitnessGoaloptions"
import { useDishesInfiniteList } from "@/hooks/queries/dishes/useDishesInfiniteList"
import { DishListItem } from "@/types/dish.type"
import { FitnessGoal, MealType } from "@/types/enum"
import { MenuRequest, MenuResponse } from "@/types/meal.type"
import { Beef, Droplet, Edit, Flame, Loader2, Plus, Search, Trash2, Wheat } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type MenuFormProps = {
  initialData?: MenuResponse
  onSubmit: (data: MenuRequest) => void
  isLoading: boolean
  appearance?: "user" | "admin"
}

type MealKey = "breakfast" | "lunch" | "dinner" | "extra"

type Dish = {
  id: number
  name: string
  image?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  quantity?: number
}

type MenuFormData = {
  name: string
  description: string
  fitnessGoal: FitnessGoal
  searchDish?: string
}

export const MenuForm = ({ initialData, onSubmit, isLoading, appearance = "user" }: MenuFormProps) => {
  const [selectedMeal, setSelectedMeal] = useState<MealKey>("breakfast")
  const [searchQuery, setSearchQuery] = useState("")
  const [meals, setMeals] = useState<Record<MealKey, Dish[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    extra: [],
  })

  const { data: dataFitnessGoalOptions = [] } = useGetFitnessGoalOptions()

  // Use infinite query for dishes list
  const {
    data: dishesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isDishesLoading,
  } = useDishesInfiniteList({
    search: searchQuery,
    size: 10,
  })

  const form = useForm<MenuFormData>({
    defaultValues: {
      name: "",
      description: "",
      fitnessGoal: "LOSE_WEIGHT" as FitnessGoal,
      searchDish: "",
    },
  })

  // Fill form data when initialData is provided
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || "",
        fitnessGoal: initialData.fitnessGoal,
        searchDish: "",
      })

      // Convert API meals to UI format
      const mealTypeToKey: Record<MealType, MealKey> = {
        [MealType.BREAKFAST]: "breakfast",
        [MealType.LUNCH]: "lunch",
        [MealType.DINNER]: "dinner",
        [MealType.EXTRA]: "extra",
      }

      const convertedMeals: Record<MealKey, Dish[]> = {
        breakfast: [],
        lunch: [],
        dinner: [],
        extra: [],
      }

      initialData.meals.forEach((meal) => {
        const mealKey = mealTypeToKey[meal.mealType]
        if (mealKey) {
          convertedMeals[mealKey] = meal.dishes.map((dish) => ({
            id: dish.dishId,
            name: dish.name,
            image: dish.image,
            calories: dish.totalCalories / (dish.quantity || 1),
            protein: dish.totalProtein / (dish.quantity || 1),
            carbs: dish.totalCarbs / (dish.quantity || 1),
            fat: dish.totalFat / (dish.quantity || 1),
            quantity: dish.quantity,
          }))
        }
      })

      setMeals(convertedMeals)
    }
  }, [initialData, form])

  // Flatten all pages of dishes
  const allDishes = useMemo(() => {
    if (!dishesData?.pages) return []
    return dishesData.pages.flatMap((page) => page.data ?? [])
  }, [dishesData])

  // Calculate total nutrition from all meals
  const totalNutrition = useMemo(() => {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0

    Object.values(meals).forEach((mealDishes) => {
      mealDishes.forEach((dish) => {
        const quantity = dish.quantity ?? 1
        totalCalories += (dish.calories ?? 0) * quantity
        totalProtein += (dish.protein ?? 0) * quantity
        totalCarbs += (dish.carbs ?? 0) * quantity
        totalFat += (dish.fat ?? 0) * quantity
      })
    })

    return {
      calories: totalCalories.toFixed(0),
      protein: totalProtein.toFixed(1),
      carbs: totalCarbs.toFixed(1),
      fat: totalFat.toFixed(1),
    }
  }, [meals])

  const addDishToMeal = (dish: DishListItem, meal: MealKey = selectedMeal) => {
    const dishData: Dish = {
      id: dish.id,
      name: dish.name,
      image: dish.image,
      calories: dish.calories,
      protein: dish.protein,
      carbs: dish.carbs,
      fat: dish.fat,
      quantity: 1,
    }

    setMeals((prev) => {
      const exists = prev[meal].some((d) => d.id === dish.id)
      if (exists) {
        // nếu đã có thì tăng quantity lên 1
        return {
          ...prev,
          [meal]: prev[meal].map((d) => (d.id === dish.id ? { ...d, quantity: (d.quantity ?? 1) + 1 } : d)),
        }
      }
      return { ...prev, [meal]: [...prev[meal], dishData] }
    })
  }

  const handleSearch = () => {
    const searchValue = form.getValues("searchDish").trim()
    setSearchQuery(searchValue || "")
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const buildPayload = (): MenuRequest => {
    const formValues = form.getValues()

    const mealsPayload = (Object.keys(meals) as MealKey[])
      .filter((mealKey) => meals[mealKey].length > 0) // Only include meals with dishes
      .map((mealKey) => {
        const mealTypeMap: Record<MealKey, MealType> = {
          breakfast: MealType.BREAKFAST,
          lunch: MealType.LUNCH,
          dinner: MealType.DINNER,
          extra: MealType.EXTRA,
        }

        return {
          name: mealTypeMap[mealKey],
          mealType: mealTypeMap[mealKey],
          dishes: meals[mealKey].map((d) => ({
            dishId: d.id,
            quantity: d.quantity ?? 1,
          })),
        }
      })

    return {
      name: formValues.name,
      description: formValues.description || undefined,
      fitnessGoal: formValues.fitnessGoal,
      meals: mealsPayload,
    }
  }

  const handleSubmit = form.handleSubmit(() => {
    // Validate that at least one meal has dishes
    const hasMeals = Object.values(meals).some((mealDishes) => mealDishes.length > 0)

    if (!hasMeals) {
      toast.error("Vui lòng thêm ít nhất một món ăn vào thực đơn")
      return
    }

    const payload = buildPayload()
    onSubmit(payload)
  })

  const updateDishQuantity = (dishId: number, delta: number, meal: MealKey = selectedMeal) => {
    setMeals((prev) => ({
      ...prev,
      [meal]: prev[meal].map((d) => (d.id === dishId ? { ...d, quantity: Math.max(1, (d.quantity ?? 1) + delta) } : d)),
    }))
  }

  const removeDishFromMeal = (dishId: number, meal: MealKey = selectedMeal) => {
    setMeals((prev) => ({ ...prev, [meal]: prev[meal].filter((d) => d.id !== dishId) }))
  }

  // helpers for tab UI
  const tabClass = (meal: MealKey) =>
    selectedMeal === meal
      ? appearance === "admin"
        ? "rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors"
        : "rounded-full border border-earth bg-earth px-4 py-2 text-sm font-semibold text-cream shadow-sm shadow-earth/10 transition-all duration-200"
      : appearance === "admin"
        ? "rounded-lg border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        : "rounded-full border border-sand/60 bg-cream/60 px-4 py-2 text-sm font-medium text-earth/65 transition-colors duration-200 hover:border-clay hover:text-earth"

  const isEdit = !!initialData
  const isAdmin = appearance === "admin"

  return (
    <Form {...form}>
      <form className={cn(isAdmin && "rounded-2xl border bg-card p-5 shadow-sm sm:p-6")}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h2 className={cn(isAdmin ? "text-xl font-semibold tracking-tight" : "font-display mb-3 text-3xl font-medium text-earth")}>
              {isAdmin ? "Thông tin thực đơn" : isEdit ? "Cập nhật thực đơn" : "Tạo thực đơn"}
            </h2>
            {isAdmin && <p className="mt-1 text-sm text-muted-foreground">Nhập thông tin cơ bản và sắp xếp món ăn theo từng bữa.</p>}
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Đang lưu...
                </>
              ) : (
                <>
                  {isEdit ? <Edit /> : <Plus />}
                  {isEdit ? "Lưu thay đổi" : "Tạo"}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <SimpleField name="name" control={form.control} label="Tên thực đơn" required>
            {(field) => <Input placeholder="Tên thực đơn" {...field} />}
          </SimpleField>
          <SimpleField name="fitnessGoal" control={form.control} label="Mục tiêu" required>
            {(field) => (
              <CustomSelect
                key={`fitnessGoal-${field.value}`}
                value={field.value}
                onChange={field.onChange}
                options={dataFitnessGoalOptions}
              />
            )}
          </SimpleField>
          <SimpleField name="description" control={form.control} label="Mô tả" className="md:col-span-2">
            {(field) => <Textarea placeholder="Mô tả" {...field} />}
          </SimpleField>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <Card className={cn("gap-0 rounded-2xl py-0", isAdmin ? "border bg-background shadow-none" : "border-sand/60 bg-white shadow-sm shadow-earth/5")}>
              <CardContent className="p-6">
                <h3 className={cn("mb-4 text-lg font-semibold", !isAdmin && "font-display font-medium text-earth")}>Danh sách món ăn</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <SimpleField name="searchDish" control={form.control} hideLabel className="flex-1">
                    {(field) => (
                      <Input
                        placeholder="Tìm kiếm món ăn..."
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleSearch()
                          }
                        }}
                      />
                    )}
                  </SimpleField>
                  <Button type="button" variant="secondary" onClick={handleSearch}>
                    <Search className="mr-2" size={16} />
                    Tìm kiếm
                  </Button>
                </div>

                <ScrollArea className="h-[400px]">
                  {isDishesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className={cn("animate-spin", isAdmin ? "text-primary" : "text-clay")} size={32} />
                    </div>
                  ) : allDishes.length === 0 ? (
                    <div className={cn("py-8 text-center", isAdmin ? "text-muted-foreground" : "text-earth/60")}>Không tìm thấy món ăn nào.</div>
                  ) : (
                    <div className="space-y-3">
                      {allDishes.map((dish) => (
                        <div key={dish.id} className={cn("flex items-center gap-4 rounded-xl border p-3 transition-colors", isAdmin ? "bg-card hover:border-primary/30 hover:bg-primary/[0.02]" : "border-sand/60 bg-cream/40 hover:border-clay/50 hover:bg-sand-light/35")}>
                          <ImageWithFallback src={dish.image} alt={dish.name} className="h-20 w-24 rounded-lg object-cover sm:w-32" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className={cn("font-semibold", !isAdmin && "text-earth")}>{dish.name}</div>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addDishToMeal(dish)
                                }}
                                title="Thêm vào thực đơn"
                                aria-label="Thêm vào thực đơn"
                              >
                                <Plus />
                              </Button>
                            </div>

                            <div className="grid grid-cols-4 gap-4 text-center text-sm">
                              <div>
                                <div className={cn("font-semibold", !isAdmin && "text-earth")}>{dish.calories}</div>
                                <div className={cn(isAdmin ? "text-muted-foreground" : "text-earth/55")}>Calo</div>
                              </div>
                              <div>
                                <div className={cn("font-semibold", !isAdmin && "text-earth")}>{dish.protein}g</div>
                                <div className={cn(isAdmin ? "text-muted-foreground" : "text-earth/55")}>Protein</div>
                              </div>
                              <div>
                                <div className={cn("font-semibold", !isAdmin && "text-earth")}>{dish.carbs}g</div>
                                <div className={cn(isAdmin ? "text-muted-foreground" : "text-earth/55")}>Carbs</div>
                              </div>
                              <div>
                                <div className={cn("font-semibold", !isAdmin && "text-earth")}>{dish.fat}g</div>
                                <div className={cn(isAdmin ? "text-muted-foreground" : "text-earth/55")}>Fat</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Load More Button */}
                      {hasNextPage && (
                        <div className="flex justify-center pt-4">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleLoadMore}
                            disabled={isFetchingNextPage}
                          >
                            {isFetchingNextPage ? (
                              <>
                                <Loader2 className="mr-2 animate-spin" size={16} />
                                Đang tải...
                              </>
                            ) : (
                              "Xem thêm"
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right column - macros + menu */}
          <div className="lg:col-span-6 space-y-6">
            <Card className={cn("gap-0 rounded-2xl", isAdmin ? "border bg-background shadow-none" : "border-sand/60 bg-white shadow-sm shadow-earth/5")}>
              <CardContent>
                <h3 className={cn("mb-4 text-lg font-semibold", !isAdmin && "font-display font-medium text-earth")}>Tổng lượng dinh dưỡng</h3>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <MacroCard label="Calories" value={totalNutrition.calories} Icon={Flame} appearance={appearance} />
                  <MacroCard label="Protein" value={`${totalNutrition.protein}g`} Icon={Beef} appearance={appearance} />
                  <MacroCard label="Carbs" value={`${totalNutrition.carbs}g`} Icon={Wheat} appearance={appearance} />
                  <MacroCard label="Fat" value={`${totalNutrition.fat}g`} Icon={Droplet} appearance={appearance} />
                </div>
              </CardContent>
            </Card>

            <Card className={cn("gap-0 rounded-2xl p-4", isAdmin ? "border bg-background shadow-none" : "border-sand/60 bg-white shadow-sm shadow-earth/5")}>
              <CardContent className="p-4">
                <h3 className={cn("mb-4 text-lg font-semibold", !isAdmin && "font-display font-medium text-earth")}>Thực đơn</h3>

                <div className="flex flex-wrap gap-3 mb-4">
                  <button type="button" className={tabClass("breakfast")} onClick={() => setSelectedMeal("breakfast")}>
                    Bữa sáng
                    <div className={cn("text-xs", selectedMeal === "breakfast" ? (isAdmin ? "text-primary-foreground/75" : "text-cream/75") : (isAdmin ? "text-muted-foreground" : "text-earth/50"))}>{meals.breakfast.length} món</div>
                  </button>
                  <button type="button" className={tabClass("lunch")} onClick={() => setSelectedMeal("lunch")}>
                    Bữa trưa
                    <div className={cn("text-xs", selectedMeal === "lunch" ? (isAdmin ? "text-primary-foreground/75" : "text-cream/75") : (isAdmin ? "text-muted-foreground" : "text-earth/50"))}>{meals.lunch.length} món</div>
                  </button>
                  <button type="button" className={tabClass("dinner")} onClick={() => setSelectedMeal("dinner")}>
                    Bữa tối
                    <div className={cn("text-xs", selectedMeal === "dinner" ? (isAdmin ? "text-primary-foreground/75" : "text-cream/75") : (isAdmin ? "text-muted-foreground" : "text-earth/50"))}>{meals.dinner.length} món</div>
                  </button>
                  <button type="button" className={tabClass("extra")} onClick={() => setSelectedMeal("extra")}>
                    Bữa phụ
                    <div className={cn("text-xs", selectedMeal === "extra" ? (isAdmin ? "text-primary-foreground/75" : "text-cream/75") : (isAdmin ? "text-muted-foreground" : "text-earth/50"))}>{meals.extra.length} món</div>
                  </button>
                </div>

                {/* Selected meal items */}
                <div className="space-y-3">
                  {meals[selectedMeal].length === 0 ? (
                    <div className={cn("rounded-xl border border-dashed px-4 py-8 text-center text-sm", isAdmin ? "bg-muted/30 text-muted-foreground" : "border-sand/70 bg-cream/40 text-earth/60")}>Chưa có món nào cho bữa này.</div>
                  ) : (
                    meals[selectedMeal].map((dish) => {
                      const quantity = dish.quantity ?? 1
                      return (
                        <div key={dish.id} className={cn("rounded-xl border p-3", isAdmin ? "bg-card" : "border-sand/60 bg-cream/45")}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className={cn("mb-1 text-sm font-semibold", !isAdmin && "text-earth")}>{dish.name}</div>
                              <div className={cn("text-xs", isAdmin ? "text-muted-foreground" : "text-earth/60")}>
                                {((dish.calories ?? 0) * quantity).toFixed(1)} kcal &nbsp; P:{" "}
                                {((dish.protein ?? 0) * quantity).toFixed(1)}g &nbsp; C:{" "}
                                {((dish.carbs ?? 0) * quantity).toFixed(1)}g &nbsp; F:{" "}
                                {((dish.fat ?? 0) * quantity).toFixed(1)}g
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Quantity controls */}
                              <div className="inline-flex items-center rounded-md p-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateDishQuantity(dish.id, -1, selectedMeal)
                                  }}
                                  aria-label="Giảm số lượng"
                                  title="Giảm số lượng"
                                  className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md", isAdmin ? "text-muted-foreground hover:bg-muted" : "text-earth/80 hover:bg-sand-light/60")}
                                >
                                  -
                                </button>

                                <div className={cn("px-3 text-sm font-medium", !isAdmin && "text-earth")}>{quantity}</div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateDishQuantity(dish.id, 1, selectedMeal)
                                  }}
                                  aria-label="Tăng số lượng"
                                  title="Tăng số lượng"
                                  className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md", isAdmin ? "text-muted-foreground hover:bg-muted" : "text-earth/80 hover:bg-sand-light/60")}
                                >
                                  +
                                </button>
                              </div>

                              <Button
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeDishFromMeal(dish.id, selectedMeal)
                                }}
                                aria-label="Xóa món"
                                title="Xóa món"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
