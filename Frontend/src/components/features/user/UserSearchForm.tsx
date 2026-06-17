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
      <form onSubmit={form.handleSubmit(handleSearch)} className="flex w-full items-start justify-between gap-2">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="w-[300px] max-w-xs">
            <SimpleField control={form.control} name="keyword" label="Tìm kiếm">
              {(field) => <Input {...field} disabled={isFetching} placeholder="Tìm theo tên, email, username" />}
            </SimpleField>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-2">
          <Button type="submit" disabled={isFetching} variant="secondary">
            <SearchIcon className="mr-2 size-4" />
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
