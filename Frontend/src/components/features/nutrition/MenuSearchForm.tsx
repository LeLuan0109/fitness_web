import { Button } from "@/components/shared/ui/button"
import { Card, CardContent } from "@/components/shared/ui/card"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { Slider } from "@/components/shared/ui/slider"
import { useGetFitnessGoalOptions } from "@/hooks/queries/common/useGetFitnessGoaloptions"
import { SearchIcon } from "lucide-react"
import { useForm } from "react-hook-form"

interface MealSearchFormData {
  title: string
  goal: string
  calories: number[]
  protein: number[]
  carbs: number[]
  fat: number[]
}

const DEFAULT_VALUES: MealSearchFormData = {
  title: "",
  goal: "",
  calories: [0, 3000],
  protein: [0, 200],
  carbs: [0, 300],
  fat: [0, 150],
}

interface MenuSearchFormProps {
  onSearch: (params: {
    search?: string
    goal?: string
    minCalories?: number
    maxCalories?: number
    minProtein?: number
    maxProtein?: number
    minCarbs?: number
    maxCarbs?: number
    minFat?: number
    maxFat?: number
  }) => void
}

export const MenuSearchForm = ({ onSearch }: MenuSearchFormProps) => {
  const form = useForm<MealSearchFormData>({
    defaultValues: DEFAULT_VALUES,
  })

  const { data: dataFitnessGoals = [] } = useGetFitnessGoalOptions()

  const handleSearch = () => {
    const data = form.getValues()

    onSearch({
      search: data.title || undefined,
      goal: data.goal || undefined,
      minCalories: data.calories[0],
      maxCalories: data.calories[1],
      minProtein: data.protein[0],
      maxProtein: data.protein[1],
      minCarbs: data.carbs[0],
      maxCarbs: data.carbs[1],
      minFat: data.fat[0],
      maxFat: data.fat[1],
    })
  }

  return (
    <Card className="border-none rounded-[20px]">
      <CardContent>
        <Form {...form}>
          <form className="flex gap-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
              <SimpleField
                label="Tên thực đơn"
                name="title"
                control={form.control}
                className="col-span-1"
                enableFormMessage={false}
              >
                {(field) => <Input {...field} />}
              </SimpleField>

              <SimpleField
                label="Mục tiêu"
                name="goal"
                control={form.control}
                className="col-span-1"
                enableFormMessage={false}
              >
                {(field) => <CustomSelect {...field} options={dataFitnessGoals} />}
              </SimpleField>

              <SimpleField
                label="Calories"
                name="calories"
                control={form.control}
                className="col-span-1"
                enableFormMessage={false}
              >
                {(field) => (
                  <div>
                    <Slider
                      value={field.value}
                      onValueChange={field.onChange}
                      min={0}
                      max={3000}
                      step={50}
                      className="mt-2"
                    />
                    <div className="mt-1 text-sm text-muted-foreground">
                      {field.value?.[0]} - {field.value?.[1]} kcal
                    </div>
                  </div>
                )}
              </SimpleField>

              <SimpleField
                label="Protein (gram)"
                name="protein"
                control={form.control}
                className="col-span-1"
                enableFormMessage={false}
              >
                {(field) => (
                  <div>
                    <Slider
                      value={field.value}
                      onValueChange={field.onChange}
                      min={0}
                      max={200}
                      step={5}
                      className="mt-2"
                    />
                    <div className="mt-1 text-sm text-muted-foreground">
                      {field.value?.[0]} - {field.value?.[1]} g
                    </div>
                  </div>
                )}
              </SimpleField>

              <SimpleField
                label="Carbs (gram)"
                name="carbs"
                control={form.control}
                className="col-span-1"
                enableFormMessage={false}
              >
                {(field) => (
                  <div>
                    <Slider
                      value={field.value}
                      onValueChange={field.onChange}
                      min={0}
                      max={300}
                      step={5}
                      className="mt-2"
                    />
                    <div className="mt-1 text-sm text-muted-foreground">
                      {field.value?.[0]} - {field.value?.[1]} g
                    </div>
                  </div>
                )}
              </SimpleField>

              <SimpleField
                label="Fat (gram)"
                name="fat"
                control={form.control}
                className="col-span-1"
                enableFormMessage={false}
              >
                {(field) => (
                  <div>
                    <Slider
                      value={field.value}
                      onValueChange={field.onChange}
                      min={0}
                      max={150}
                      step={5}
                      className="mt-2"
                    />
                    <div className="mt-1 text-sm text-muted-foreground">
                      {field.value?.[0]} - {field.value?.[1]} g
                    </div>
                  </div>
                )}
              </SimpleField>
            </div>
            <Button
              type="button"
              onClick={handleSearch}
              variant="secondary"
              aria-label="Tìm kiếm món ăn"
              className="mt-7"
            >
              <SearchIcon className="h-4 w-4" />
              Tìm kiếm
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
