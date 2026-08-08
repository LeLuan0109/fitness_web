import { Button } from "@/components/shared/ui/button"
import { Card, CardContent } from "@/components/shared/ui/card"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { TypographyH3 } from "@/components/shared/ui/typography"
import { useChangePassword } from "@/hooks/queries/user/useChangePassword"
import { CHANGE_PASSWORD_SCHEMA, ChangePasswordDTO } from "@/schemas/change-password.schema"
import authStore from "@/stores/auth.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type ChangePasswordFormProps = {
  showHeader?: boolean
}

export const ChangePasswordForm = ({ showHeader = true }: ChangePasswordFormProps) => {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const clearAuth = authStore.use.clearAuth()

  const form = useForm<ChangePasswordDTO>({
    resolver: zodResolver(CHANGE_PASSWORD_SCHEMA),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onBlur",
  })

  const { mutate: mutateChangePassword, isPending } = useChangePassword({
    config: {
      onSuccess: () => {
        toast.success("Đổi mật khẩu thành công")
        form.reset()
        clearAuth()
      },
      onError: (error) => {
        toast.error(error.response.data.error.message)
      },
    },
  })

  const onSubmit = (data: ChangePasswordDTO) => {
    mutateChangePassword(data)
  }

  return (
    <div>
      <div className={`flex items-center mb-6 ${showHeader ? "justify-between" : "justify-end"}`}>
        {showHeader && <TypographyH3 variant="bold">Đổi mật khẩu</TypographyH3>}
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
          <Save />
          Lưu
        </Button>
      </div>
      <Card>
        <CardContent>
          <Form {...form}>
            <form id="change-password-form" className="md:max-w-1/2">
              <SimpleField
                control={form.control}
                name="oldPassword"
                label="Mật khẩu cũ"
                required
                icon={
                  <Button
                    className="bg-transparent text-white hover:bg-transparent hover:cursor-pointer"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    type="button"
                  >
                    {showOldPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </Button>
                }
              >
                {(field) => (
                  <Input type={showOldPassword ? "text" : "password"} placeholder="Old Password" {...field} />
                )}
              </SimpleField>
              <SimpleField
                control={form.control}
                name="newPassword"
                label="Mật khẩu mới"
                required
                icon={
                  <Button
                    type="button"
                    className="bg-transparent text-white hover:bg-transparent hover:cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </Button>
                }
              >
                {(field) => (
                  <Input type={showNewPassword ? "text" : "password"} placeholder="New Password" {...field} />
                )}
              </SimpleField>
              <SimpleField
                control={form.control}
                name="confirmNewPassword"
                label="Xác nhận mật khẩu mới"
                required
                icon={
                  <Button
                    type="button"
                    className="bg-transparent text-white hover:bg-transparent hover:cursor-pointer"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  >
                    {showConfirmNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </Button>
                }
              >
                {(field) => (
                  <Input
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    {...field}
                  />
                )}
              </SimpleField>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
