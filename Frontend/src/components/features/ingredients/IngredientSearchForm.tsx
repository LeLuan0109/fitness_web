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
      <form onSubmit={form.handleSubmit(handleSearch)} className="flex w-full items-start justify-between gap-2">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="w-[300px] max-w-xs">
            <SimpleField control={form.control} name="search" label="Tìm kiếm">
              {(field) => <Input {...field} disabled={isFetching} placeholder="Tìm kiếm nguyên liệu..." />}
            </SimpleField>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-2">
          <Button type="submit" variant="secondary" disabled={isFetching}>
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
