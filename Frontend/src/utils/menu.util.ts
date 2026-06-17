import { Role } from "@/types/role.type"
import { MENU_ITEMS } from "@/constants/side-bar"

export const getMenuItemsByRole = (role: Role | null) => {
  if (!role) return []
  
  return MENU_ITEMS.filter((menuGroup) => {
    // Nếu menu không có yêu cầu role, hiển thị cho tất cả
    if (!menuGroup.allowedRoles) return true
    
    // Kiểm tra role có được phép không
    return menuGroup.allowedRoles.includes(role)
  })
}
