import { getUserProfile } from "@/api/user.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { UserProfileData, UserProfileResponse } from "@/types/user.type"
import { transformUserProfile } from "@/utils/user.utils"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetProfile = () => {
  return useQuery<Response<UserProfileResponse>, AxiosError<ResponseError>, UserProfileData>({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: getUserProfile,
    select: transformUserProfile,
  })
}
