import { SelectedTableData } from "@/components/features/table/selected-table-data/selected-table-data"
import { TypographyH2 } from "@/components/shared/ui/typography"
import { PageLayout } from "@/layouts/PageLayout"

export const SelectedTablePage = () => {
  return (
    <PageLayout title={"table:selectedTable.title"}>
      <TypographyH2>{"table:selectedTable.title"}</TypographyH2>
      <SelectedTableData />
    </PageLayout>
  )
}
