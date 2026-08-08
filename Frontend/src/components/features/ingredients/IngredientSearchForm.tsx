import { Search } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useForm, type SubmitHandler } from "react-hook-form"

import { Button } from "@/components/shared/ui/button"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"

type IngredientSearchFormValues = {
  search: string
}

const DEFAULT_SEARCH_VALUES = {
  search: "",
}

interface IngredientSearchFormProps {
  isFetching: boolean
}

export function IngredientSearchForm({ isFetching }: IngredientSearchFormProps) {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))

  const form = useForm<IngredientSearchFormValues>({
    defaultValues: {
      search: search || "",
    },
  })

  const handleSearch: SubmitHandler<IngredientSearchFormValues> = (data) => {
    setSearch(data.search || null)
  }

  const handleClear = () => {
    form.reset(DEFAULT_SEARCH_VALUES)
    setSearch(null)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSearch)} className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <div className="w-full sm:max-w-md">
            <SimpleField control={form.control} name="search" label="Tìm kiếm">
              {(field) => <Input {...field} disabled={isFetching} placeholder="Tìm theo tên nguyên liệu..." className="border-slate-200 bg-white focus-visible:ring-blue-600" />}
            </SimpleField>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isFetching} className="bg-blue-600 text-white hover:bg-blue-700">
            <Search className="mr-2 size-4" />
            Tìm kiếm
          </Button>
          <Button type="button" variant="ghost" onClick={handleClear} disabled={isFetching}>
            Xóa bộ lọc
          </Button>
        </div>
      </form>
    </Form>
  )
}
