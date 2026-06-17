import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { Textarea } from "@/components/shared/ui/textarea"
import { DEFAULT_DISH_FORM } from "@/constants/dish,constant"
import { ROUTES } from "@/constants/routes"
import { useCreateDish } from "@/hooks/queries/dishes/useCreateDish"
import { useDishDetail } from "@/hooks/queries/dishes/useDishDetail"
import { useIngredientOptions } from "@/hooks/queries/dishes/useIngredientOptions"
import { useIngredientUnits } from "@/hooks/queries/dishes/useIngredientUnits"
import { useUpdateDish } from "@/hooks/queries/dishes/useUpdateDish"
import { DishFormData, DishFormSchema } from "@/schemas/dish.schema"
import { DishRequest } from "@/types/dish.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, ChevronRight, Image as ImageIcon, Plus, Trash2, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"

type DishFormProps = {
  isEdit?: boolean
}

export const DishForm = ({ isEdit }: DishFormProps) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [imagePreview, setImagePreview] = useState<string>("")

  const form = useForm<DishFormData>({
    resolver: zodResolver(DishFormSchema),
    defaultValues: DEFAULT_DISH_FORM,
    mode: "onBlur",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  })

  const { data: dishData, isLoading: isLoadingDish } = useDishDetail(isEdit ? id : undefined)
  const { data: ingredientOptions = [] } = useIngredientOptions()
  const { data: unitOptions = [] } = useIngredientUnits()
  const { mutate: createMutate, isPending: isCreating } = useCreateDish()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateDish()

  const isPending = isCreating || isUpdating

  // Load data for edit mode
  useEffect(() => {
    if (isEdit && dishData && !isLoadingDish) {
      form.reset({
        name: dishData.name,
        cookingTime: dishData.cookingTime,
        calories: dishData.calories,
        protein: dishData.protein,
        fat: dishData.fat,
        carbs: dishData.carbs,
        preparation: dishData.preparation,
        ingredients: dishData.ingredients.map((ing) => ({
          ingredientId: ing.ingredient.id,
          quantity: ing.quantity,
          unit: ing.unit,
          preparationNote: ing.preparationNote || "",
        })),
      })
      if (dishData.image) {
        setImagePreview(dishData.image)
      }
    }
  }, [isEdit, dishData, isLoadingDish, form])

  // Handle image preview
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

  const handleSubmit = (data: DishFormData) => {
    const request: DishRequest = {
      name: data.name,
      cookingTime: data.cookingTime,
      calories: data.calories,
      protein: data.protein,
      fat: data.fat,
      carbs: data.carbs,
      preparation: data.preparation,
      image: data.image?.[0],
      ingredients: data.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        quantity: ing.quantity,
        unit: ing.unit,
        preparationNote: ing.preparationNote,
      })),
    }

    if (isEdit && id) {
      updateMutate(
        { id, data: request },
        {
          onSuccess: () => {
            toast.success("Cập nhật món ăn thành công!")
            navigate(ROUTES.DISHES.LIST)
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.error?.message || "Có lỗi xảy ra khi cập nhật món ăn")
          },
        },
      )
    } else {
      createMutate(request, {
        onSuccess: () => {
          toast.success("Tạo món ăn mới thành công!")
          navigate(ROUTES.DISHES.LIST)
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.error?.message || "Có lỗi xảy ra khi tạo món ăn")
        },
      })
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" onClick={handleBack}>
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          Quay lại
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle>{isEdit ? "Chỉnh sửa món ăn" : "Tạo món ăn mới"}</CardTitle>
              <CardDescription>Nhập thông tin chi tiết về món ăn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SimpleField name="name" control={form.control} label="Tên món ăn" required>
                  {(field) => <Input {...field} placeholder="Ví dụ: Cơm chiên hải sản" />}
                </SimpleField>

                <SimpleField name="cookingTime" control={form.control} label="Thời gian nấu (phút)" required>
                  {(field) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="30"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  )}
                </SimpleField>
              </div>

              <SimpleField name="preparation" control={form.control} label="Cách chế biến" required>
                {(field) => <Textarea {...field} placeholder="Hướng dẫn chi tiết cách chế biến món ăn..." rows={6} />}
              </SimpleField>

              {/* Image Upload */}
              <SimpleField name="image" control={form.control} label="Hình ảnh món ăn">
                {(field) => (
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80 w-fit"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Chọn ảnh
                    </label>
                    {imagePreview && (
                      <div className="relative w-full h-60 border rounded-md overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </SimpleField>
            </CardContent>
          </Card>

          {/* Giá trị dinh dưỡng */}
          <Card>
            <CardHeader>
              <CardTitle>Giá trị dinh dưỡng</CardTitle>
              <CardDescription>Thông tin dinh dưỡng trên 100g</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SimpleField name="calories" control={form.control} label="Calories (kcal)" required>
                  {(field) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  )}
                </SimpleField>

                <SimpleField name="protein" control={form.control} label="Protein (g)" required>
                  {(field) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  )}
                </SimpleField>

                <SimpleField name="carbs" control={form.control} label="Carbs (g)" required>
                  {(field) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  )}
                </SimpleField>

                <SimpleField name="fat" control={form.control} label="Fat (g)" required>
                  {(field) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  )}
                </SimpleField>
              </div>
            </CardContent>
          </Card>

          {/* Nguyên liệu */}
          <Card>
            <CardHeader>
              <CardTitle>Nguyên liệu</CardTitle>
              <CardDescription>Danh sách nguyên liệu cần thiết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-4">
                    <SimpleField name={`ingredients.${index}.ingredientId`} control={form.control} label="Nguyên liệu">
                      {(field) => (
                        <CustomSelect
                          searchable
                          options={ingredientOptions ?? []}
                          placeholder="Chọn nguyên liệu"
                          value={field.value ? field.value.toString() : ""}
                          onChange={(value) => field.onChange(value ? Number(value) : 0)}
                        />
                      )}
                    </SimpleField>
                  </div>

                  <div className="col-span-2">
                    <SimpleField name={`ingredients.${index}.quantity`} control={form.control} label="Số lượng">
                      {(field) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          placeholder="100"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                        />
                      )}
                    </SimpleField>
                  </div>

                  <div className="col-span-2">
                    <SimpleField name={`ingredients.${index}.unit`} control={form.control} label="Đơn vị">
                      {(field) => (
                        <CustomSelect
                          options={unitOptions}
                          placeholder="Chọn đơn vị"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    </SimpleField>
                  </div>

                  <div className="col-span-3">
                    <SimpleField name={`ingredients.${index}.preparationNote`} control={form.control} label="Ghi chú">
                      {(field) => <Input {...field} placeholder="Cắt nhỏ, băm..." />}
                    </SimpleField>
                  </div>

                  <div className="col-span-1 flex items-start mt-[28px]">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className={fields.length === 1 ? "text-muted-foreground cursor-not-allowed" : "text-destructive"}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    ingredientId: 0,
                    quantity: 0,
                    unit: "",
                    preparationNote: "",
                  })
                }
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm nguyên liệu
              </Button>
            </CardContent>
          </Card>

          {/* Submit buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                "Đang xử lý..."
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isEdit ? "Cập nhật" : "Tạo mới"}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleBack}>
              <XIcon className="w-4 h-4 mr-2" />
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
