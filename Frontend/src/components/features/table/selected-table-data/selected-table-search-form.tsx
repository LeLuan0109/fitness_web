import { SearchIcon } from "lucide-react"
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { useForm, type SubmitHandler } from "react-hook-form"

import { Button } from "@/components/shared/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/ui/select"
import type { PrimeContractorUsersDTO } from "@/types/example.type"
import { removeEmptyValues } from "@/utils/utils"

const DEFAULT_SEARCH_VALUES = {
  groups_id_in: "",
  roles_id_eq: "",
  users_name_cont: "",
  users_email_cont: "",
  statusItem_id_eq: "",
}

const DEFAULT_SEARCH_VALUES_NUQS = {
  groups_id_in: null,
  roles_id_eq: null,
  users_name_cont: null,
  users_email_cont: null,
  statusItem_id_eq: null,
}

const FAKE_GROUP_LIST = [
  { label: "IT Department", value: "1" },
  { label: "HR Department", value: "2" },
  { label: "Finance Department", value: "3" },
  { label: "Marketing Department", value: "4" },
]

const FAKE_ROLE_LIST = [
  { label: "Admin", value: "1" },
  { label: "Manager", value: "2" },
  { label: "User", value: "3" },
  { label: "Guest", value: "4" },
]

const FAKE_STATUS_LIST = [
  { label: "Active", value: "1" },
  { label: "Inactive", value: "2" },
  { label: "Pending", value: "3" },
  { label: "Blocked", value: "4" },
]

export const SelectedTableSearchForm = ({ isFetching }: { isFetching?: boolean }) => {
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    groups_id_in: parseAsArrayOf(parseAsInteger),
    roles_id_eq: parseAsInteger,
    users_name_cont: parseAsString,
    users_email_cont: parseAsString,
    statusItem_id_eq: parseAsInteger,
  })

  const form = useForm<PrimeContractorUsersDTO>({
    defaultValues: removeEmptyValues(queryStates) as unknown as PrimeContractorUsersDTO,
  })

  // Compare data with queryStates and updateParams if needed
  const handleSearch: SubmitHandler<PrimeContractorUsersDTO> = (data) => {
    setQueryStates({
      ...queryStates,
      groups_id_in: data.groups_id_in ? [Number(data.groups_id_in)] : null,
      roles_id_eq: data.roles_id_eq ? Number(data.roles_id_eq) : null,
      users_name_cont: data.users_name_cont || null,
      users_email_cont: data.users_email_cont || null,
      statusItem_id_eq: data.statusItem_id_eq ? Number(data.statusItem_id_eq) : null,
      page: 1,
    })
  }

  const handleClear = () => {
    form.reset(DEFAULT_SEARCH_VALUES)
    setQueryStates(DEFAULT_SEARCH_VALUES_NUQS)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSearch)} className="flex w-full items-start justify-between gap-2">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="w-[200px] max-w-xs">
            <FormField
              control={form.control}
              name="groups_id_in"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"table:simpleTable.searchForm.groups"}</FormLabel>
                  <Select disabled={isFetching} onValueChange={field.onChange} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder={"table:simpleTable.searchForm.groups"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FAKE_GROUP_LIST.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="w-[200px] max-w-xs">
            <FormField
              control={form.control}
              name="roles_id_eq"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"table:simpleTable.searchForm.roles"}</FormLabel>
                  <Select disabled={isFetching} onValueChange={field.onChange} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder={"table:simpleTable.searchForm.roles"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FAKE_ROLE_LIST.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="w-[200px] max-w-xs">
            <FormField
              control={form.control}
              name="users_name_cont"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"table:simpleTable.searchForm.name"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"table:simpleTable.searchForm.name"}
                      disabled={isFetching}
                      maxLength={255}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.trim())}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="w-[200px] max-w-xs">
            <FormField
              control={form.control}
              name="users_email_cont"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"table:simpleTable.searchForm.email"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"table:simpleTable.searchForm.email"}
                      disabled={isFetching}
                      maxLength={100}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.trim())}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="w-[200px] max-w-xs">
            <FormField
              control={form.control}
              name="statusItem_id_eq"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"table:simpleTable.searchForm.status"}</FormLabel>
                  <Select disabled={isFetching} onValueChange={field.onChange} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder={"table:simpleTable.searchForm.status"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FAKE_STATUS_LIST.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5">
          <Button type="submit" variant="outline" className="w-[100px]">
            <SearchIcon />
            {"button:search"}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClear}>
            {"button:clear"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
