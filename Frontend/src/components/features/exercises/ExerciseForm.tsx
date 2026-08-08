import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { Textarea } from "@/components/shared/ui/textarea"
import { MultiSelect } from "@/components/shared/ui/multi-select"
import { LEVEL_OPTIONS } from "@/constants/common"
import { ROUTES } from "@/constants/routes"
import { useGetEquipmentOptions } from "@/hooks/queries/equipment/useGetEquipmentoptions"
import { useGetMuscleGroupOptions } from "@/hooks/queries/muscle-group/useGetMuscleGroupOptions"
import { useGetTrainingTypeOptions } from "@/hooks/queries/training-type/useGetTrainingTypeOptions"
import { DEFAULT_EXERCISE_FORM, EXERCISE_SCHEMA, ExerciseFormDTO } from "@/schemas/exercise.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Image as ImageIcon, Loader2, Plus, Save, Video, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useNavigate } from "react-router"

type ExerciseFormProps = {
  idEdit?: string
  initialData?: ExerciseFormDTO
  onSubmit: (data: ExerciseFormDTO) => void
  isLoading?: boolean
  existingThumbnail?: string
  existingVideo?: string
}

export function ExerciseForm({
  idEdit,
  initialData,
  onSubmit,
  isLoading,
  existingThumbnail,
  existingVideo,
}: ExerciseFormProps) {
  const navigate = useNavigate()
  const isEdit = Boolean(idEdit)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [videoPreview, setVideoPreview] = useState<string>("")

  const form = useForm<ExerciseFormDTO>({
    resolver: zodResolver(EXERCISE_SCHEMA),
    defaultValues: initialData || DEFAULT_EXERCISE_FORM,
    mode: "onBlur",
  })

  const { data: dataMuscleGroupsOptions } = useGetMuscleGroupOptions()
  const { data: dataEquipmentOptions } = useGetEquipmentOptions()
  const { data: dataTrainingTypeOptions } = useGetTrainingTypeOptions()

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control: form.control,
    name: "steps",
  })

  const {
    fields: tipFields,
    append: appendTip,
    remove: removeTip,
  } = useFieldArray({
    control: form.control,
    name: "tips",
  })

  const {
    fields: mistakeFields,
    append: appendMistake,
    remove: removeMistake,
  } = useFieldArray({
    control: form.control,
    name: "mistakes",
  })

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control: form.control,
    name: "benefits",
  })

  // Handle thumbnail preview
  useEffect(() => {
    // Set existing thumbnail/video preview on mount if available
    if (existingThumbnail) {
      setThumbnailPreview(existingThumbnail)
    }
    if (existingVideo) {
      setVideoPreview(existingVideo)
    }
  }, [existingThumbnail, existingVideo])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "thumbnail") {
        const files = value.thumbnail
        if (files && files.length > 0) {
          const file = files[0]
          const reader = new FileReader()
          reader.onloadend = () => {
            setThumbnailPreview(reader.result as string)
          }
          reader.readAsDataURL(file)
        }
      }
      if (name === "video") {
        const files = value.video
        if (files && files.length > 0) {
          const file = files[0]
          const url = URL.createObjectURL(file)
          setVideoPreview(url)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleSubmit = (data: ExerciseFormDTO) => {
    onSubmit(data)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{isEdit ? "Chỉnh sửa bài tập" : "Tạo bài tập mới"}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isEdit ? "Cập nhật thông tin bài tập" : "Thêm bài tập mới vào hệ thống"}
          </p>
        </div>
        <Button variant="outline" className="self-start border-slate-200" onClick={() => navigate(ROUTES.EXERCISES.LIST)}>
          <ArrowLeft className="mr-2 size-4" />
          Quay lại danh sách
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Thông tin cơ bản */}
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg text-slate-900">Thông tin cơ bản</CardTitle>
              <CardDescription>Các thông tin chính về bài tập</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SimpleField name="name" control={form.control} label="Tên bài tập" required>
                  {(field) => <Input {...field} placeholder="Ví dụ: Bench Press" />}
                </SimpleField>

                <SimpleField name="level" control={form.control} label="Cấp độ" required>
                  {(field) => (
                    <CustomSelect
                      options={LEVEL_OPTIONS}
                      placeholder="Chọn cấp độ"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                </SimpleField>

                <SimpleField name="trainingTypeId" control={form.control} label="Loại hình tập luyện" required>
                  {(field) => (
                    <CustomSelect
                      searchable
                      options={dataTrainingTypeOptions ?? []}
                      placeholder="Chọn loại hình"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                </SimpleField>

                <SimpleField name="met" control={form.control} label="MET (Metabolic Equivalent)" required>
                  {(field) => <Input {...field} type="number" step="0.1" placeholder="Ví dụ: 5.5" />}
                </SimpleField>
              </div>

              <SimpleField name="description" control={form.control} label="Mô tả" required>
                {(field) => <Textarea {...field} placeholder="Mô tả chi tiết về bài tập" rows={4} />}
              </SimpleField>
            </CardContent>
          </Card>

          {/* Nhóm cơ */}
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg text-slate-900">Nhóm cơ</CardTitle>
              <CardDescription>Chọn các nhóm cơ được tác động</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SimpleField name="primaryMuscleGroupIds" control={form.control} label="Nhóm cơ chính" required>
                {(field) => (
                  <MultiSelect
                    options={
                      dataMuscleGroupsOptions?.map((opt) => ({
                        label: opt.label,
                        value: opt.value,
                      })) ?? []
                    }
                    placeholder="Chọn nhóm cơ chính"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    maxCount={3}
                    resetOnDefaultValueChange
                  />
                )}
              </SimpleField>

              <SimpleField name="secondaryMuscleGroupIds" control={form.control} label="Nhóm cơ phụ">
                {(field) => (
                  <MultiSelect
                    options={
                      dataMuscleGroupsOptions?.map((opt) => ({
                        label: opt.label,
                        value: opt.value,
                      })) ?? []
                    }
                    placeholder="Chọn nhóm cơ phụ"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    maxCount={3}
                    resetOnDefaultValueChange
                  />
                )}
              </SimpleField>
            </CardContent>
          </Card>

          {/* Thiết bị */}
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg text-slate-900">Thiết bị</CardTitle>
              <CardDescription>Dụng cụ cần thiết cho bài tập</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleField name="equipmentIds" control={form.control} label="Thiết bị">
                {(field) => (
                  <MultiSelect
                    options={
                      dataEquipmentOptions?.map((opt) => ({
                        label: opt.label,
                        value: opt.value,
                      })) ?? []
                    }
                    placeholder="Chọn thiết bị"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    maxCount={3}
                    resetOnDefaultValueChange
                  />
                )}
              </SimpleField>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg text-slate-900">Hình ảnh & Video</CardTitle>
              <CardDescription>Tải lên thumbnail và video hướng dẫn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SimpleField name="thumbnail" control={form.control} label="Thumbnail">
                  {(field) => (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files)}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label
                          htmlFor="thumbnail-upload"
                          className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Chọn ảnh
                        </label>
                      </div>
                      {thumbnailPreview && (
                        <div className="relative w-full h-40 border rounded-md overflow-hidden">
                          <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </SimpleField>

                <SimpleField name="video" control={form.control} label="Video hướng dẫn">
                  {(field) => (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => field.onChange(e.target.files)}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                        >
                          <Video className="w-4 h-4" />
                          Chọn video
                        </label>
                      </div>
                      {videoPreview && (
                        <div className="relative w-full h-40 border rounded-md overflow-hidden">
                          <video src={videoPreview} controls className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </SimpleField>
              </div>
            </CardContent>
          </Card>

          {/* Các bước thực hiện */}
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg text-slate-900">Các bước thực hiện</CardTitle>
              <CardDescription>Hướng dẫn từng bước chi tiết</CardDescription>
              {form.formState.errors.steps?.message && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.steps.message}</p>
              )}
              {form.formState.errors.steps?.root?.message && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.steps.root.message}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {stepFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex h-10 w-8 flex-shrink-0 items-center justify-center rounded-md bg-blue-50 text-sm font-semibold text-blue-700">
                    {index + 1}
                  </div>
                  <SimpleField name={`steps.${index}.value`} control={form.control} hideLabel className="flex-1">
                    {(field) => <Textarea {...field} placeholder="Nhập bước thực hiện" rows={2} />}
                  </SimpleField>
                  {stepFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStep(index)}
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendStep({ value: "" })}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm bước
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Mẹo luyện tập</CardTitle>
              <CardDescription>Các lưu ý giúp tập hiệu quả hơn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tipFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <SimpleField name={`tips.${index}.value`} control={form.control} hideLabel className="flex-1">
                    {(field) => <Input {...field} placeholder="Nhập mẹo" />}
                  </SimpleField>
                  {tipFields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeTip(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendTip({ value: "" })}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm mẹo
              </Button>
            </CardContent>
          </Card>

          {/* Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle>Lỗi thường gặp</CardTitle>
              <CardDescription>Những sai lầm cần tránh</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mistakeFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <SimpleField name={`mistakes.${index}.value`} control={form.control} hideLabel className="flex-1">
                    {(field) => <Input {...field} placeholder="Nhập lỗi thường gặp" />}
                  </SimpleField>
                  {mistakeFields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeMistake(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendMistake({ value: "" })}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm lỗi
              </Button>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Lợi ích</CardTitle>
              <CardDescription>Những lợi ích khi thực hiện bài tập</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {benefitFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <SimpleField name={`benefits.${index}.value`} control={form.control} hideLabel className="flex-1">
                    {(field) => <Input {...field} placeholder="Nhập lợi ích" />}
                  </SimpleField>
                  {benefitFields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeBenefit(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendBenefit({ value: "" })}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm lợi ích
              </Button>
            </CardContent>
          </Card>

          {/* Submit buttons */}
          <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <Button type="button" variant="outline" onClick={() => navigate(ROUTES.EXERCISES.LIST)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!isLoading && <Save className="mr-2 size-4" />}
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
