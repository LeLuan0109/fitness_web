import { ChangeEvent, JSX, useRef, useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { FileAudio, FileIcon, FileImage, FileText, FileVideo, Plus, Trash2, Upload, X } from "lucide-react"
import { Button } from "../ui/button"
import axios from "axios"

type FileWithProgress = {
  id: string
  file: File
  progress: number
  uploaded: boolean
}

export function FileUpload() {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) {
      return
    }
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      progress: 0,
      uploaded: false,
      id: file.name,
    }))
    setFiles([...files, ...newFiles])

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  function removeFile(id: string) {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id))
  }

  function handleClear() {
    setFiles([])
  }

  async function handleUpload() {
    if (files.length === 0 || uploading) {
      return
    }
    setUploading(true)
    await Promise.all(
      files.map(async (fileWithProgress) => {
        const formData = new FormData()
        formData.append("file", fileWithProgress.file)
        try {
          await axios.post("https://httpbin.org/post", formData, {
            onUploadProgress: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
              setFiles((prevFiles) =>
                prevFiles.map((f) => (f.id === fileWithProgress.id ? { ...f, progress: percent } : f)),
              )
            },
          })
          setFiles((prevFiles) => prevFiles.map((f) => (f.id === fileWithProgress.id ? { ...f, uploaded: true } : f)))
        } catch (error) {
          console.error("Upload failed for file:", fileWithProgress.file.name, error)
        }
      }),
    )
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">File Upload</h2>
      <div className="flex gap-2 ">
        <FileInput inputRef={inputRef} disable={uploading} onFileSelect={handleFileSelect} />
        <ActionButtons onUpload={handleUpload} onClear={handleClear} disabled={files.length === 0 || uploading} />
      </div>
      <FileList files={files} onRemove={removeFile} uploading={uploading} />
    </div>
  )
}

type FileInputProps = {
  inputRef: React.RefObject<HTMLInputElement>
  disable: boolean
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void
}

function FileInput({ inputRef, disable, onFileSelect }: FileInputProps) {
  return (
    <div>
      <Input
        ref={inputRef}
        type="file"
        onChange={onFileSelect}
        multiple
        className="hidden"
        id="file-upload"
        disabled={disable}
      />
      <Label
        htmlFor="file-upload"
        className="flex cursor-pointer items-center gap-2 rounded-md bg-earth px-6 py-2 text-cream"
      >
        <Plus size={18} />
        Select Files
      </Label>
    </div>
  )
}

type ActionButtonsProps = {
  disabled: boolean
  onUpload: () => void
  onClear: () => void
}

function ActionButtons({ onUpload, onClear, disabled }: ActionButtonsProps) {
  return (
    <>
      <Button onClick={onUpload} disabled={disabled} className="flex items-center gap-2">
        <Upload size={18} />
        Upload
      </Button>
      <Button onClick={onClear} className="flex items-center gap-2" disabled={disabled}>
        <Trash2 size={18} />
        Clear All
      </Button>
    </>
  )
}

type FileListProps = {
  files: FileWithProgress[]
  onRemove: (id: string) => void
  uploading: boolean
}

function FileList({ files, onRemove, uploading }: FileListProps) {
  if (files.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Files: </h3>
      <div className="space-y-2">
        {files.map((file) => (
          <FileItem key={file.id} file={file} onRemove={onRemove} uploading={uploading} />
        ))}
      </div>
    </div>
  )
}

type FileItemProps = {
  file: FileWithProgress
  onRemove: (id: string) => void
  uploading: boolean
}

function FileItem({ file, onRemove, uploading }: FileItemProps): JSX.Element {
  const Icon = getFileIcon(file.file.type)
  return (
    <div className="space-y-2 rounded-md border border-sand/60 bg-cream/60 p-4 text-earth">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Icon size={40} className="text-primary" />
          <div className="flex flex-col">
            <span className="font-medium">{file.file.name}</span>
            <div className="flex items-center gap-2 text-xs text-earth/55">
              <span>{formatFileSize(file.file.size)}</span>
              <span>.</span>
              <span>{file.file.type || "Unknow type"}</span>
            </div>
          </div>
        </div>
        {!uploading && (
          <Button onClick={() => onRemove(file.id)} className="bg-none p-0">
            <X size={16} className="text-earth" />
          </Button>
        )}
      </div>
      <div className="text-earth">{file.uploaded ? "Completed" : `${Math.round(file.progress)}%`}</div>
      <ProgressBar progress={file.progress} />
    </div>
  )
}

type ProgressBarProps = {
  progress: number
}

function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-sand-light">
      <div className="h-full bg-clay transition-all duration-300" style={{ width: `${progress}%` }} />
    </div>
  )
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("/image")) return FileImage
  if (mimeType.startsWith("/video")) return FileVideo
  if (mimeType.startsWith("/audio")) return FileAudio
  if (mimeType.startsWith("/application/pdf")) return FileText
  return FileIcon
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
