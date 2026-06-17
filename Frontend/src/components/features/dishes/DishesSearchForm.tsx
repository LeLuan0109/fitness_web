import { Button } from "@/components/shared/ui/button"
import { Card, CardContent } from "@/components/shared/ui/card"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { Search } from "lucide-react"
import React from "react"
import { useForm } from "react-hook-form"

interface DishesSearchFormProps {
  onSearch?: (query: { name?: string; cookingTime?: number }) => void
}

type FormValues = {
  name: string
  cookingTime: string
}

export const DishesSearchForm: React.FC<DishesSearchFormProps> = ({ onSearch }) => {
  const form = useForm<FormValues>({ defaultValues: { name: "", cookingTime: "" } })

  const handleSearch = (values: FormValues) => {
    onSearch?.({
      name: values.name || undefined,
      cookingTime: values.cookingTime ? Number(values.cookingTime) : undefined,
    })
  }

  return (
    <Card className="rounded-md mb-6">
      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end" onSubmit={form.handleSubmit(handleSearch)}>
            <SimpleField label="Tên món" name="name" control={form.control} enableFormMessage={false}>
              {(field) => <Input {...field} />}
            </SimpleField>

            <SimpleField
              label="Thời gian nấu (phút)"
              name="cookingTime"
              control={form.control}
              enableFormMessage={false}
            >
              {(field) => <Input {...field} type="number" min="0" placeholder="Ví dụ: 30" />}
            </SimpleField>

            <div className="flex items-center md:justify-end">
              <Button type="submit" variant="secondary">
                <Search />
                Tìm kiếm
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
