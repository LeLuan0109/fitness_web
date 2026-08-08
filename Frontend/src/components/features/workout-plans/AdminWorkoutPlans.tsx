import { Button } from "@/components/shared/ui/button"
import { ROUTES } from "@/constants/routes"
import { Plus, Sparkles } from "lucide-react"
import { useNavigate } from "react-router"
import { AdminSampleWorkout } from "./AdminSampleWorkout"
import { OutstandingPlan } from "./OutstandingPlan"

export function AdminWorkoutPlans() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-7 text-primary-foreground shadow-xl shadow-primary/15">
        <div className="absolute -right-16 -top-20 size-56 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" /> Thư viện quản trị
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Kế hoạch tập luyện mẫu</h1>
            <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80">
              Quản lý, cập nhật và phát hành các kế hoạch tập luyện cho người dùng.
            </p>
          </div>
          <Button
            onClick={() => navigate(ROUTES.WORKOUTS.CREATE)}
            className="gap-2 bg-white text-primary shadow-md hover:bg-white/90"
          >
            <Plus className="size-4" /> Tạo kế hoạch mẫu
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-primary/15 bg-card/80 p-6 shadow-sm">
        <OutstandingPlan appearance="admin" />
      </section>

      <AdminSampleWorkout />
    </div>
  )
}
