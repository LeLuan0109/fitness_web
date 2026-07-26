import { Progress } from "@/components/features/progress/Progress"
import { ProgressDashboard } from "@/components/features/progress/ProgressDashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/tabs"
import { PageLayout } from "@/layouts/PageLayout"

export function ProgressPage() {
  return (
    <PageLayout title="Tăng tiến">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="strength">Tiến bộ sức mạnh</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ProgressDashboard />
        </TabsContent>
        <TabsContent value="strength">
          <Progress />
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
