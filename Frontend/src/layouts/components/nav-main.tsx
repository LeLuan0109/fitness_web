import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/shared/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/shared/ui/sidebar"
import type { MenuGroup, MenuItem } from "@/types/common.type"
import { map } from "lodash-es"
import { ChevronDown } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

function renderMenuItem(item: MenuItem, location: any, navigate: any) {
  if (item.children && item.children.length > 0) {
    // Có submenu
    return (
      <Collapsible defaultOpen className="group/collapsible" key={item.title}>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={item.title}>
            <CollapsibleTrigger className="flex w-full items-center">
              {item.icon && <item.icon />}
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarMenuButton>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((sub) => (
                <SidebarMenuSubItem key={sub.url || sub.title}>
                  <SidebarMenuSubButton
                    isActive={location.pathname === sub.url}
                    onClick={() => sub.url && navigate(sub.url)}
                  >
                    {sub.title}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }
  // Không có submenu
  return (
    <SidebarMenuItem key={item.url}>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={location.pathname === item.url}
        onClick={() => item.url && navigate(item.url)}
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function NavMain({ items }: { readonly items: MenuGroup }) {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{items.group}</SidebarGroupLabel>
      <SidebarMenu>{map(items.children, (item) => renderMenuItem(item, location, navigate))}</SidebarMenu>
    </SidebarGroup>
  )
}
