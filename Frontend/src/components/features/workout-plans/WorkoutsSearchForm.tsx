import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardTitle } from "@/components/shared/ui/card"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { FITNESS_GOAL_OPTIONS, LEVEL_OPTIONS } from "@/constants/common"
import { WorkoutPlanSearchParams } from "@/types/workout-plan.type"
import { removeEmptyValues } from "@/utils/utils"
import { SearchIcon } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"

type Props = {
  onSearch: Dispatch<SetStateAction<WorkoutPlanSearchParams>>
}

export function WorkoutsSearchForm({ onSearch }: Props) {
  const form = useForm()

  const handleSearch = () => {
    const values = removeEmptyValues(form.getValues())
    onSearch(values)
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <CardTitle>Tìm kiếm kế hoạch tập luyện</CardTitle>
        <div className="flex gap-8 justify-between">
          <Form {...form}>
            <form className="flex flex-wrap w-full gap-x-6 gap-y-2">
              <SimpleField
                label="Từ khóa"
                name="keyword"
                control={form.control}
                className="w-[220px]"
                enableFormMessage={false}
              >
                {(field) => <Input {...field} />}
              </SimpleField>
              <SimpleField
                label="Mục tiêu tập luyện"
                name="goal"
                control={form.control}
                className="w-[220px]"
                enableFormMessage={false}
              >
                {(field) => <CustomSelect {...field} options={FITNESS_GOAL_OPTIONS} />}
              </SimpleField>
              <SimpleField
                label="Cấp độ"
                name="level"
                control={form.control}
                className="w-[220px]"
                enableFormMessage={false}
              >
                {(field) => <CustomSelect {...field} options={LEVEL_OPTIONS} />}
              </SimpleField>
              <SimpleField
                label="Thời gian"
                name="duration"
                control={form.control}
                className="w-[220px]"
                enableFormMessage={false}
              >
                {(field) => (
                  <CustomSelect
                    {...field}
                    options={[
                      { label: "1 tuần", value: "1" },
                      { label: "2 tuần", value: "2" },
                      { label: "4 tuần", value: "4" },
                      { label: "6 tuần", value: "6" },
                      { label: "8 tuần", value: "8" },
                    ]}
                  />
                )}
              </SimpleField>
            </form>
          </Form>
          <Button variant="secondary" className="mt-6" onClick={handleSearch}>
            <SearchIcon /> Tìm kiếm
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
