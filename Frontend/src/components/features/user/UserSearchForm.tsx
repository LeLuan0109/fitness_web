import { SearchIcon } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useForm, type SubmitHandler } from "react-hook-form"

import { Button } from "@/components/shared/ui/button"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"

type UserSearchFormValues = {
  keyword: string
}

const DEFAULT_SEARCH_VALUES = {
  keyword: "",
}

export const UserSearchForm = ({ isFetching }: { isFetching?: boolean }) => {
  const [keyword, setKeyword] = useQueryState("keyword", parseAsString.withDefault(""))

  const form = useForm<UserSearchFormValues>({
    defaultValues: {
      keyword: keyword || "",
    },
  })

  const handleSearch: SubmitHandler<UserSearchFormValues> = (data) => {
    setKeyword(data.keyword || null)
  }

  const handleClear = () => {
    form.reset(DEFAULT_SEARCH_VALUES)
    setKeyword(null)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSearch)} className="flex w-full flex-col gap-3 border-b border-border bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="w-full sm:w-[340px]">
            <SimpleField control={form.control} name="keyword" label="Tìm kiếm">
              {(field) => (
                <Input
                  {...field}
                  disabled={isFetching}
                  placeholder="Nhập tên, email hoặc username..."
                  className="admin-search rounded-lg border-border bg-input-background"
                />
              )}
            </SimpleField>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isFetching} className="gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            <SearchIcon className="size-4" />
            Tìm kiếm
          </Button>
          <Button type="button" variant="outline" onClick={handleClear} disabled={isFetching} className="rounded-lg border-border hover:bg-muted">
            Xóa bộ lọc
          </Button>
        </div>
      </form>
    </Form>
  )
}
