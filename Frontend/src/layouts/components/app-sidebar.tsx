import { map } from "lodash-es"
import * as React from "react"
import { useNavigate } from "react-router-dom"

import logo from "@/assets/favicon.jpg"
import logoExpanded from "@/assets/logo_expanded.jpg"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/shared/ui/sidebar"
import { MENU_ITEMS } from "@/constants/side-bar"
import { NavMain } from "@/layouts/components/nav-main"
import authStore from "@/stores/auth.store"
import { MenuItem } from "@/types/common.type"
import { Role } from "@/types/role.type"

// Helper function to filter menu items recursively
const filterMenuItems = (items: MenuItem[], userRole: Role): MenuItem[] => {
  return items
    .filter((item) => {
      // Nếu không có allowedRoles, cho phép tất cả
      if (!item.allowedRoles || item.allowedRoles.length === 0) {
        return true
      }
      // Kiểm tra role.name
      return item.allowedRoles.some((allowedRole) => allowedRole.name === userRole.name)
    })
    .map((item) => ({
      ...item,
      // Đệ quy filter children nếu có
      children: item.children ? filterMenuItems(item.children, userRole) : undefined,
    }))
    .filter((item) => {
      // Loại bỏ parent nếu không còn children nào
      if (item.children && item.children.length === 0 && !item.url) {
        return false
      }
      return true
    })
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const navigate = useNavigate()
  const userRole = authStore.use.auth()?.role

  const filteredMenuItems = React.useMemo(() => {
    if (!userRole) return []

    return MENU_ITEMS.map((menuGroup) => ({
      ...menuGroup,
      // Filter children của group
      children: filterMenuItems(menuGroup.children, userRole),
    })).filter((menuGroup) => {
      // Loại bỏ group nếu không còn children nào
      return menuGroup.children.length > 0
    })
  }, [userRole])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:!text-[#f7f8f8]">
              <button onClick={() => navigate("/")} className="hover:!bg-[unset]">
                <div className="flex items-center justify-center">
                  <img
                    src={state === "collapsed" ? logo : logoExpanded}
                    alt="Logo"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {map(filteredMenuItems, (item) => (
          <NavMain key={item.group} items={item} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
