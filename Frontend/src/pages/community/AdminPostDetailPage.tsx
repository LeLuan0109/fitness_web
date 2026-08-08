import { PostDetail } from "@/components/features/community/PostDetail"
import { PageLayout } from "@/layouts/PageLayout"
import { MessageSquareText, ShieldCheck } from "lucide-react"

export function AdminPostDetailPage() {
  return (
    <PageLayout title="Chi tiết bài viết">
      <div className="space-y-6 text-slate-950">
        <header className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
          <div className="h-1 bg-blue-600" aria-hidden="true" />
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <MessageSquareText className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">Chi tiết bài viết cộng đồng</h1>
                <p className="mt-1 text-sm leading-6 text-slate-600">Xem nội dung, tương tác và phản hồi của bài viết.</p>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Chế độ quản trị
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl rounded-2xl bg-slate-50/60 p-1 sm:p-2 [&_[data-slot=card]]:border-slate-200 [&_[data-slot=card]]:bg-white [&_[data-slot=card]]:shadow-sm [&_textarea]:border-slate-300 [&_textarea]:bg-white [&_textarea]:focus-visible:ring-blue-600">
          <PostDetail />
        </main>
      </div>
    </PageLayout>
  )
}
