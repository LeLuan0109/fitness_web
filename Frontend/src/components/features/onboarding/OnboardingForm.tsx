import { getBasicInfo } from "@/api/auth.api"
import { Button } from "@/components/shared/ui/button"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { Label } from "@/components/shared/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/shared/ui/radio-group"
import { SimpleDatePicker } from "@/components/shared/ui/simple-datepicker"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { TypographyH2, TypographyH3 } from "@/components/shared/ui/typography"
import { ACTIVITY_LEVEL_OPTIONS } from "@/constants/common"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { ROUTES } from "@/constants/routes"
import { useUpdateOnboarding } from "@/hooks/queries/auth/useUpdateOnboarding"
import { queryClient } from "@/lib/react-query"
import { ONBOARDING_FORM_SCHEMA, OnboardingFormData } from "@/schemas/onboarding.schema"
import authStore from "@/stores/auth.store"
import { FitnessGoal, GENDER } from "@/types/enum"
import { OnboardingDTO } from "@/types/user.type"
import { formatDateddMMyyyy } from "@/utils/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export function OnboardingForm() {
  const navigate = useNavigate()
  const clearAuth = authStore.use.clearAuth()
  const form = useForm({
    resolver: zodResolver(ONBOARDING_FORM_SCHEMA),
    defaultValues: {
      sex: GENDER.MALE,
      dateOfBirth: null,
      weight: "",
      height: "",
      fitnessGoal: FitnessGoal.SHAPE_BODY,
      activityLevel: "",
      experienceLevel: "",
      daysPerWeekAvailable: "",
      targetWeight: "",
    },
    mode: "onBlur",
  })

  const EXPERIENCE_OPTIONS = [
    { label: "Người mới (< 6 tháng)", value: "NEW" },
    { label: "Trung bình (6 tháng - 2 năm)", value: "INTERMEDIATE" },
    { label: "Lâu năm (> 2 năm)", value: "EXPERT" },
  ]

  const { mutate: mutateOnboarding } = useUpdateOnboarding({
    config: {
      onSuccess: async () => {
        toast.success("Cập nhật thông tin thành công!")
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BASIC_INFO] })
        const resp = await queryClient.fetchQuery({ queryKey: [QUERY_KEYS.BASIC_INFO], queryFn: () => getBasicInfo() })
        const profile = resp?.data
        if (profile) {
          authStore.getState().setAuth({
            id: profile.id,
            email: profile.email,
            username: profile.username,
            name: profile.name,
            avatar: profile.avatar,
            role: profile.role,
            isOnboardingCompleted: profile.onboardingCompleted,
          })
        }
        navigate(ROUTES.HOME, { replace: true })
      },
      onError: () => {
        toast.error("Cập nhật thông tin thất bại, vui lòng thử lại!")
      },
    },
  })

  const onSubmit = (data: OnboardingFormData) => {
    const payload: OnboardingDTO = {
      sex: data.sex,
      dateOfBirth: formatDateddMMyyyy(data.dateOfBirth),
      weight: Number(data.weight),
      height: Number(data.height),
      fitnessGoal: data.fitnessGoal,
      activityLevel: data.activityLevel,
      experienceLevel: data.experienceLevel || undefined,
      daysPerWeekAvailable: data.daysPerWeekAvailable ? Number(data.daysPerWeekAvailable) : undefined,
      targetWeight: data.targetWeight ? Number(data.targetWeight) : undefined,
    }
    mutateOnboarding(payload)
  }

  return (
    <div className="min-h-screen flex flex-col gap-y-8 items-center justify-center">
      <TypographyH2 variant="bold">Hãy cung cấp một vài thông tin để chúng tôi phục vụ bạn tốt hơn</TypographyH2>
      <Form {...form}>
        <form className="grid grid-cols-2 gap-x-10 gap-y-4 px-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <TypographyH3>Giới tính của bạn là gì?</TypographyH3>
            <SimpleField control={form.control} name="sex" hideLabel>
              {(field) => (
                <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex gap-6">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={GENDER.MALE} id="male" />
                    <Label htmlFor="male">Nam</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={GENDER.FEMALE} id="female" />
                    <Label htmlFor="female">Nữ</Label>
                  </div>
                </RadioGroup>
              )}
            </SimpleField>
          </div>
          <div className="flex flex-col gap-4">
            <TypographyH3>Ngày sinh bạn?</TypographyH3>
            <SimpleField control={form.control} name="dateOfBirth" hideLabel>
              {(field) => (
                <SimpleDatePicker
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Vui lòng chọn ngày sinh"
                />
              )}
            </SimpleField>
          </div>
          <div className="flex flex-col gap-4">
            <TypographyH3>Cân nặng của bạn? (kg)</TypographyH3>
            <SimpleField control={form.control} name="weight" hideLabel>
              {(field) => <Input type="number" {...field} />}
            </SimpleField>
          </div>
          <div className="flex flex-col gap-4">
            <TypographyH3>Chiều cao của bạn? (cm)</TypographyH3>
            <SimpleField control={form.control} name="height" hideLabel>
              {(field) => <Input type="number" {...field} />}
            </SimpleField>
          </div>
          <div className="flex flex-col gap-4 ">
            <TypographyH3>Mục tiêu tập luyện của bạn là gì?</TypographyH3>
            <SimpleField control={form.control} name="fitnessGoal" hideLabel>
              {(field) => (
                <RadioGroup defaultValue={field.value} onValueChange={field.onChange} className="flex gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={FitnessGoal.LOSE_WEIGHT} id="lose-weight" />
                    <Label htmlFor="lose-weight">Giảm cân</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={FitnessGoal.GAIN_WEIGHT} id="gain-weight" />
                    <Label htmlFor="gain-weight">Tăng cân</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={FitnessGoal.MUSCLE_MASS_GAIN} id="maintain-weight" />
                    <Label htmlFor="maintain-weight">Tăng cơ</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={FitnessGoal.SHAPE_BODY} id="shape-body" />
                    <Label htmlFor="shape-body">Giữ dáng</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={FitnessGoal.OTHERS} id="others-goal" />
                    <Label htmlFor="others-goal">Khác</Label>
                  </div>
                </RadioGroup>
              )}
            </SimpleField>
          </div>
          <div className="flex flex-col gap-4 ">
            <TypographyH3>Mức độ hoạt động của bạn?</TypographyH3>
            <SimpleField control={form.control} name="activityLevel" hideLabel>
              {(field) => (
                <CustomSelect options={ACTIVITY_LEVEL_OPTIONS} value={field.value} onChange={field.onChange} />
              )}
            </SimpleField>
          </div>
          <div className="flex flex-col gap-4">
            <TypographyH3>Kinh nghiệm tập luyện? (tùy chọn)</TypographyH3>
            <SimpleField control={form.control} name="experienceLevel" hideLabel>
              {(field) => (
                <CustomSelect
                  options={EXPERIENCE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn trình độ (giúp gợi ý độ khó chính xác hơn)"
                />
              )}
            </SimpleField>
          </div>
          <div className="flex flex-col gap-4">
            <TypographyH3>Số buổi rảnh tập/tuần? (tùy chọn)</TypographyH3>
            <SimpleField control={form.control} name="daysPerWeekAvailable" hideLabel>
              {(field) => <Input type="number" min={1} max={7} placeholder="VD: 3" {...field} />}
            </SimpleField>
          </div>
          <div className="flex flex-col gap-4">
            <TypographyH3>Cân nặng mục tiêu? (kg, tùy chọn)</TypographyH3>
            <SimpleField control={form.control} name="targetWeight" hideLabel>
              {(field) => <Input type="number" placeholder="VD: 65" {...field} />}
            </SimpleField>
          </div>
          <div className="hidden md:block" />

          <div className="flex items-center gap-8 col-span-2 justify-center mt-8">
            <Button
              variant="outline"
              className="min-w-sm"
              type="button"
              onClick={() => {
                clearAuth()
                navigate(ROUTES.AUTH.LOGIN, { replace: true })
              }}
            >
              Quay lại
            </Button>
            <Button className="min-w-sm" type="submit">
              Gửi
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
