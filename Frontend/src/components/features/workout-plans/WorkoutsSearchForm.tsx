import { CoreformFilterCard, CoreformSearchButton } from "@/components/shared/coreform"
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
    <CoreformFilterCard title="Tìm kiếm kế hoạch tập luyện">
      <Form {...form}>
        <form className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            <SimpleField
              label="Từ khóa"
              name="keyword"
              control={form.control}
              className="w-[220px]"
              enableFormMessage={false}
            >
              {(field) => <Input {...field} className="rounded-xl border-sand/60 bg-cream/50" />}
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
          </div>
          <CoreformSearchButton type="button" onClick={handleSearch}>
            <SearchIcon className="size-4" /> Tìm kiếm
          </CoreformSearchButton>
        </form>
      </Form>
    </CoreformFilterCard>
  )
}
