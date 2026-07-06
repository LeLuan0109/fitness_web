import { Button } from "@/components/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  content?: string
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  variant?: "destructive" | "default"
  icon?: React.ReactNode
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title = "Xác nhận",
  content = "Bạn có chắc chắn muốn thực hiện hành động này?",
  onConfirm,
  onCancel,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "default",
  icon,
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-earth/5 text-clay">
            {icon || (variant === "destructive" ? <AlertTriangle className="size-5" /> : null)}
          </div>
          <DialogTitle>{title}</DialogTitle>
          {content && <DialogDescription className="text-left">{content}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:flex-row">
          <Button variant="outline" className="rounded-full border-sand" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            className={cn("rounded-full", variant === "default" && "bg-earth text-cream hover:bg-clay")}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
