import { Button } from "@/components/shared/ui/button"
import { useNavigate } from "react-router-dom"
import { ShieldAlert } from "lucide-react"

export const ForbiddenPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 p-8">
        <ShieldAlert className="w-24 h-24 mx-auto text-destructive" />
        <h1 className="text-6xl font-bold text-foreground">403</h1>
        <h2 className="text-2xl font-semibold text-foreground">Truy cập bị từ chối</h2>
        <p className="text-muted-foreground max-w-md">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            Quay lại
          </Button>
          <Button onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
      </div>
    </div>
  )
}
