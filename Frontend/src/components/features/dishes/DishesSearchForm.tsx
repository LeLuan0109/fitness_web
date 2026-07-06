import { CoreformFilterCard, CoreformSearchButton } from "@/components/shared/coreform"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { Search } from "lucide-react"
import { useForm } from "react-hook-form"

interface DishesSearchFormProps {
  onSearch?: (query: { name?: string; cookingTime?: number }) => void
}

type FormValues = {
  name: string
  cookingTime: string
}

export const DishesSearchForm = ({ onSearch }: DishesSearchFormProps) => {
  const form = useForm<FormValues>({ defaultValues: { name: "", cookingTime: "" } })

  const handleSearch = (values: FormValues) => {
    onSearch?.({
      name: values.name || undefined,
      cookingTime: values.cookingTime ? Number(values.cookingTime) : undefined,
    })
  }

  return (
    <CoreformFilterCard>
      <Form {...form}>
        <form className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={form.handleSubmit(handleSearch)}>
          <SimpleField label="Tên món" name="name" control={form.control} enableFormMessage={false}>
            {(field) => <Input {...field} className="rounded-xl border-sand/60 bg-cream/50" />}
          </SimpleField>

          <SimpleField label="Thời gian nấu (phút)" name="cookingTime" control={form.control} enableFormMessage={false}>
            {(field) => (
              <Input {...field} type="number" min="0" placeholder="Ví dụ: 30" className="rounded-xl border-sand/60 bg-cream/50" />
            )}
          </SimpleField>

          <CoreformSearchButton type="submit">
            <Search className="size-4" />
            Tìm kiếm
          </CoreformSearchButton>
        </form>
      </Form>
    </CoreformFilterCard>
  )
}
