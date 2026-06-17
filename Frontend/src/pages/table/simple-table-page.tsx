import { SimpleTableData } from "@/components/features/table/simple-table/simple-table-data"
import { TypographyH2 } from "@/components/shared/ui/typography"
import { PageLayout } from "@/layouts/PageLayout"

export const SimpleTablePage = () => {
  return (
    <PageLayout title={"table:simpleTable.title"}>
      <TypographyH2>{"table:simpleTable.title"}</TypographyH2>
      <SimpleTableData />
    </PageLayout>
  )
}
