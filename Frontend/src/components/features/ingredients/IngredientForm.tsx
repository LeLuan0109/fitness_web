import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Image as ImageIcon, Loader2, Save, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"

import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { ROUTES } from "@/constants/routes"
import { useIngredientUnits } from "@/hooks/queries/dishes/useIngredientUnits"
import { IngredientFormData, IngredientFormSchema } from "@/schemas/ingredient.schema"
import type { IngredientRequest } from "@/types/ingredient.type"

type IngredientFormProps = {
  idEdit?: string
  initialData?: IngredientFormData
  onSubmit: (data: IngredientRequest) => void
  isLoading?: boolean
  existingImage?: string
}

export function IngredientForm({ idEdit, initialData, onSubmit, isLoading, existingImage }: IngredientFormProps) {
  const navigate = useNavigate()
  const isEdit = Boolean(idEdit)
  const [imagePreview, setImagePreview] = useState<string>("")

  const { data: unitOptions = [] } = useIngredientUnits()

  const form = useForm<IngredientFormData>({
    resolver: zodResolver(IngredientFormSchema),
    defaultValues: initialData || {
      name: "",
      standardUnit: "",
      caloriesPerUnit: 0,
      image: undefined,
    },
    mode: "onBlur",
  })

  // Handle image preview
  useEffect(() => {
    // Set existing image preview on mount if available
    if (existingImage) {
      setImagePreview(existingImage)
    }
  }, [existingImage])

  // Handle image preview on change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "image") {
        const files = value.image
        if (files && files.length > 0) {
          const file = files[0]
          const reader = new FileReader()
          reader.onloadend = () => {
            setImagePreview(reader.result as string)
          }
          reader.readAsDataURL(file)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleSubmit = (data: IngredientFormData) => {
    const request: IngredientRequest = {
      name: data.name,
      standardUnit: data.standardUnit,
      caloriesPerUnit: data.caloriesPerUnit,
      image: data.image?.[0],
    }

    onSubmit(request)
  }

  const handleBack = () => {
    navigate(ROUTES.INGREDIENTS.LIST)
  }

  const handleRemoveImage = () => {
    setImagePreview("")
    form.setValue("image", undefined)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {isEdit ? "Chỉnh sửa nguyên liệu" : "Tạo nguyên liệu mới"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEdit ? "Cập nhật thông tin nguyên liệu trong hệ thống." : "Thêm nguyên liệu vào kho dữ liệu dinh dưỡng."}
          </p>
        </div>
        <Button type="button" variant="outline" className="self-start border-slate-200" onClick={handleBack}>
          <ArrowLeft className="mr-2 size-4" />
          Quay lại
        </Button>
      </div>

      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg text-slate-900">Thông tin nguyên liệu</CardTitle>
          <CardDescription>Tên, đơn vị chuẩn, năng lượng và hình ảnh hiển thị.</CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Name */}
              <SimpleField control={form.control} name="name" label="Tên nguyên liệu" required>
                {(field) => <Input {...field} placeholder="Nhập tên nguyên liệu" disabled={isLoading} />}
              </SimpleField>

              {/* Standard Unit */}
              <SimpleField name="standardUnit" control={form.control} label="Đơn vị chuẩn" required>
                {(field) => (
                  <CustomSelect {...field} options={unitOptions} placeholder="Chọn đơn vị chuẩn" disabled={isLoading} />
                )}
              </SimpleField>

              {/* Calories Per Unit */}
              <SimpleField control={form.control} name="caloriesPerUnit" label="Calo/Đơn vị" required>
                {(field) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="Nhập số calo trên đơn vị"
                    disabled={isLoading}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              </SimpleField>

              {/* Image */}
              <SimpleField control={form.control} name="image" label="Hình ảnh">
                {(field) => (
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative w-full max-w-md">
                        <img src={imagePreview} alt="Preview" className="h-64 w-full rounded-xl border border-slate-200 object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={handleRemoveImage}
                          disabled={isLoading}
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex h-64 w-full max-w-md items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
                        <div className="text-center">
                          <ImageIcon className="mx-auto size-10 text-slate-400" />
                          <p className="mt-2 text-sm text-slate-500">Chưa có hình ảnh</p>
                        </div>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        field.onChange(e.target.files)
                      }}
                      disabled={isLoading}
                    />
                  </div>
                )}
              </SimpleField>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
                  {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                  {isLoading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Tạo mới"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
