import { Ban, ShieldCheck } from "lucide-react"

import { CoreformLiftLoader } from "@/components/shared/coreform"
import { Button } from "@/components/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shared/ui/dialog"
import { useUpdateUserStatus } from "@/hooks/queries/user"
import type { UserResponse } from "@/types/user.type"
import { useState } from "react"

type UserActionsProps = {
  user: UserResponse
}

export const UserActions = ({ user }: UserActionsProps) => {
  const [open, setOpen] = useState(false)
  const { mutate: updateUserStatus, isPending } = useUpdateUserStatus()

  if (user.role.name !== "USER") {
    return null
  }

  const handleConfirm = () => {
    updateUserStatus(
      { userId: user.id, isLocked: !user.isLocked },
      {
        onSuccess: () => {
          setOpen(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {user.isLocked ? (
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-border hover:bg-muted">
            <ShieldCheck className="size-4" />
            Mở khóa
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
            <Ban className="size-4" />
            Khóa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-xl border-border bg-popover backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground">{user.isLocked ? "Mở khóa người dùng" : "Khóa người dùng"}</DialogTitle>
          <DialogDescription>
            {user.isLocked
              ? `Bạn có chắc chắn muốn mở khóa tài khoản "${user.username}"? Người dùng sẽ có thể đăng nhập lại bình thường.`
              : `Bạn có chắc chắn muốn khóa tài khoản "${user.username}"? Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-lg border-border" onClick={() => setOpen(false)} disabled={isPending}>
            Hủy
          </Button>
          <Button
            variant={user.isLocked ? "default" : "destructive"}
            className="rounded-lg"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <CoreformLiftLoader size="sm" />
                Đang xử lý...
              </span>
            ) : user.isLocked ? (
              "Mở khóa"
            ) : (
              "Khóa tài khoản"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
