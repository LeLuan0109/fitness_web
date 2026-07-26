import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleDatePicker } from "@/components/shared/ui/simple-datepicker"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { ACTIVITY_LEVEL_OPTIONS, FITNESS_GOAL_OPTIONS, GENDER_OPTIONS } from "@/constants/common"
import { useUpdateUserProfile } from "@/hooks/queries/user/useUpdateUserProfile"
import { PERSONAL_INFO_SCHEMA } from "@/schemas/personal-info.schema"
import { PersonalInfoData, UpdateUserProfileRequest } from "@/types/user.type"
import { formatDateddMMyyyy } from "@/utils/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { isValid, parse } from "date-fns"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

// Backend trả dateOfBirth dạng chuỗi "dd/MM/yyyy" — cần parse thành Date thật
// trước khi đưa vào SimpleDatePicker (nếu không, date-fns format() sẽ throw "Invalid time value").
function parseDateddMMyyyy(value: unknown): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value
  const parsed = parse(String(value), "dd/MM/yyyy", new Date())
  return isValid(parsed) ? parsed : undefined
}

type PersonalInfoProps = {
  personalInfo: PersonalInfoData
  avatarFile?: File
}

export const PersonalInfo = ({ personalInfo, avatarFile }: PersonalInfoProps) => {
  const form = useForm({
    resolver: zodResolver(PERSONAL_INFO_SCHEMA),
    defaultValues: {
      name: personalInfo.name,
      email: personalInfo.email,
      dateOfBirth: parseDateddMMyyyy(personalInfo?.dateOfBirth),
      height: personalInfo.height.toString(),
      weight: personalInfo.weight.toString(),
      activityLevel: personalInfo.activityLevel,
      fitnessGoal: personalInfo.fitnessGoal,
      gender: personalInfo.gender,
    },
    mode: "onBlur",
  })

  const { mutate: updateProfile, isPending } = useUpdateUserProfile({
    config: {
      onSuccess: () => {
        toast.success("Cập nhật thông tin cá nhân thành công")
      },
      onError: () => {
        toast.error("Cập nhật thông tin cá nhân thất bại")
      },
    },
  })

  const onSubmit = () => {
    const data = form.getValues()
    const payload: UpdateUserProfileRequest = {
      name: data.name,
      dateOfBirth: formatDateddMMyyyy(data.dateOfBirth),
      weight: data.weight ? Number(data.weight) : null,
      height: data.height ? Number(data.height) : null,
      avatar: data.avatar ?? null,
      activityLevel: data.activityLevel,
      fitnessGoal: data.fitnessGoal,
    }
    updateProfile({ data: payload, avatarFile })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>Cập nhật thông tin hồ sơ của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 items-start">
                <SimpleField control={form.control} name="name" label="Họ và tên">
                  {(field) => <Input {...field} />}
                </SimpleField>
                <SimpleField control={form.control} name="email" label="Email" required>
                  {(field) => <Input {...field} type="email" disabled />}
                </SimpleField>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <SimpleField control={form.control} name="dateOfBirth" label="Ngày sinh" required>
                  {(field) => <SimpleDatePicker {...field} value={field.value} onChange={field.onChange} />}
                </SimpleField>
                <SimpleField control={form.control} name="height" label="Chiều cao (cm)" required>
                  {(field) => <Input {...field} type="number" />}
                </SimpleField>
                <SimpleField control={form.control} name="weight" label="Cân nặng (kg)" required>
                  {(field) => <Input {...field} type="number" />}
                </SimpleField>
                <SimpleField control={form.control} name="gender" label="Giới tính" required>
                  {(field) => (
                    <CustomSelect {...field} options={GENDER_OPTIONS} placeholder="Chọn giới tính" disabled />
                  )}
                </SimpleField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SimpleField control={form.control} name="activityLevel" label="Mức độ vận động" required>
                  {(field) => (
                    <CustomSelect {...field} options={ACTIVITY_LEVEL_OPTIONS} placeholder="Chọn mức độ vận động" />
                  )}
                </SimpleField>
                <SimpleField control={form.control} name="fitnessGoal" label="Mục tiêu" required>
                  {(field) => <CustomSelect {...field} options={FITNESS_GOAL_OPTIONS} placeholder="Chọn mục tiêu" />}
                </SimpleField>
              </div>

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
