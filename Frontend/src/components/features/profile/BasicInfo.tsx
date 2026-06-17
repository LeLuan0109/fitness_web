import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar"
import { Card, CardContent } from "@/components/shared/ui/card"
import { Button } from "@/components/shared/ui/button"
import { BasicInfoData } from "@/types/user.type"
import { Camera } from "lucide-react"
import { useRef, useState } from "react"

type BasicInfoProps = {
  basicInfo: BasicInfoData
  setAvatarFile?: (file: File | undefined) => void
}

export const BasicInfo = ({ basicInfo, setAvatarFile }: BasicInfoProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(basicInfo?.avatar || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh!")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB!")
        return
      }

      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      setAvatarFile?.(file)
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt="Avatar" className="object-cover" />
              ) : (
                <AvatarFallback className="text-2xl">
                  {(basicInfo?.username || "")
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .map((s) => s[0].toUpperCase())
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Camera Icon Button */}
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 shadow-md hover:shadow-lg transition-shadow"
              onClick={handleCameraClick}
            >
              <Camera className="h-4 w-4" />
            </Button>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl mb-1">{basicInfo?.username}</h2>
            <p className="text-muted-foreground mb-4">Là thành viên từ {basicInfo?.memberSince}</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl">{basicInfo?.totalWorkouts}</div>
                <p className="text-xs text-muted-foreground">Buổi tập</p>
              </div>
              <div>
                <div className="text-2xl">{basicInfo?.totalHours}</div>
                <p className="text-xs text-muted-foreground">Giờ</p>
              </div>
              <div>
                <div className="text-2xl">{basicInfo?.totalCalories.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
