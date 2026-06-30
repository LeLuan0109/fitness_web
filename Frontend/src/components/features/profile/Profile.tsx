import { BasicInfo } from "@/components/features/profile/BasicInfo"
import { PersonalInfo } from "@/components/features/profile/PersonalInfo"
import { useGetProfile } from "@/hooks/queries/user/useGetProfile"
import { useState } from "react"
import { MonthlyStats } from "./MonthlyStats"

export const Profile = () => {
  const { data, isLoading, error } = useGetProfile()
  const [avatarFile, setAvatarFile] = useState<File | undefined>()

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton for BasicInfo */}
        <div className="bg-muted animate-pulse rounded-lg h-32"></div>
        {/* Skeleton for PersonalInfo */}
        <div className="bg-muted animate-pulse rounded-lg h-48"></div>
        {/* Skeleton for MonthlyStats */}
        <div className="bg-muted animate-pulse rounded-lg h-64"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Có lỗi xảy ra khi tải thông tin profile</div>
  }

  return (
    <div className="space-y-6">
      <BasicInfo basicInfo={data.basicInfo} setAvatarFile={setAvatarFile} />
      <PersonalInfo personalInfo={data.personalInfo} avatarFile={avatarFile} />
      <MonthlyStats monthlyStats={data.monthlyStats} />
    </div>
  )
}
