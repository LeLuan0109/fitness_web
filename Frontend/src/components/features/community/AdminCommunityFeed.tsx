import { ShieldCheck } from "lucide-react"
import { CommunityFeed } from "./feed"

export function AdminCommunityFeed() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-7 text-primary-foreground shadow-xl shadow-primary/15">
        <div className="absolute -right-16 -top-20 size-56 rounded-full bg-white/15 blur-3xl" />
        <div className="relative">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <ShieldCheck className="size-3.5" /> Trung tâm kiểm duyệt
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Quản trị cộng đồng</h1>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80">
            Theo dõi nội dung, tương tác và kiểm duyệt các bài chia sẻ trong cộng đồng.
          </p>
        </div>
      </section>

      <CommunityFeed showHeader={false} appearance="admin" />
    </div>
  )
}
