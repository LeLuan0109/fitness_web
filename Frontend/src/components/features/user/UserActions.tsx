import { Ban, ShieldCheck } from "lucide-react"

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

  // Only show actions for users with role "USER"
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
          <Button variant="outline" size="sm" className="gap-2">
            <ShieldCheck className="size-4" />
            Mở khóa
          </Button>
        ) : (
          <Button variant="destructive" size="sm" className="gap-2">
            <Ban className="size-4" />
            Khóa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.isLocked ? "Mở khóa người dùng" : "Khóa người dùng"}</DialogTitle>
          <DialogDescription>
            {user.isLocked
              ? `Bạn có chắc chắn muốn mở khóa tài khoản "${user.username}"?`
              : `Bạn có chắc chắn muốn khóa tài khoản "${user.username}"? Người dùng sẽ không thể đăng nhập sau khi bị khóa.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Hủy
          </Button>
          <Button variant={user.isLocked ? "default" : "destructive"} onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
