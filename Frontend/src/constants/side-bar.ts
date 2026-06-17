import { Apple, BookOpen, Calendar, Dumbbell, Home, LayoutDashboard, Users } from "lucide-react"

import type { MenuGroup } from "@/types/common.type"
import { ROUTES } from "./routes"
import { ROLE_ADMIN, ROLE_USER } from "./roles.constant"

export const MENU_ITEMS: MenuGroup[] = [
  // Menu chung cho cả Admin và User
  {
    group: "Trang chủ",
    children: [
      {
        title: "Trang chủ",
        url: ROUTES.HOME,
        icon: Home,
        allowedRoles: [ROLE_USER],
      },
    ],
  },

  // Menu Admin
  {
    group: "Admin",
    children: [
      {
        title: "Dashboard",
        url: ROUTES.ADMIN.DASHBOARD,
        icon: LayoutDashboard,
        allowedRoles: [ROLE_ADMIN],
      },
      {
        title: "Quản lý người dùng",
        url: ROUTES.ADMIN.USERS,
        icon: Users,
        allowedRoles: [ROLE_ADMIN],
      },
    ],
  },

  // Menu Bài tập - Chung cho cả Admin và User
  {
    group: "Quản lý bài tập",
    children: [
      {
        title: "Bài tập",
        icon: Dumbbell,
        children: [
          {
            title: "Danh sách bài tập",
            url: ROUTES.EXERCISES.LIST,
            allowedRoles: [ROLE_ADMIN, ROLE_USER],
          },
        ],
      },
    ],
  },

  // Menu User
  {
    group: "Tập luyện",
    children: [
      {
        title: "Kế hoạch tập luyện",
        icon: Calendar,
        children: [
          {
            title: "Kế hoạch mẫu",
            url: ROUTES.WORKOUTS.SAMPLE_LIST,
            allowedRoles: [ROLE_USER, ROLE_ADMIN],
          },
          {
            title: "Kế hoạch của tôi",
            url: ROUTES.WORKOUTS.MY_LIST,
            allowedRoles: [ROLE_USER],
          },
        ],
      },
    ],
  },
  {
    group: "Nhật ký",
    children: [
      {
        title: "Nhật ký",
        url: ROUTES.HISTORY,
        icon: BookOpen,
        allowedRoles: [ROLE_USER],
      },
    ],
  },
  {
    group: "Dinh dưỡng",
    children: [
      {
        title: "Dinh dưỡng",
        icon: Apple,
        children: [
          {
            title: "Thực đơn mẫu",
            url: ROUTES.NUTRITION.SAMPLE,
            allowedRoles: [ROLE_USER, ROLE_ADMIN],
          },
          {
            title: "Thực đơn của tôi",
            url: ROUTES.NUTRITION.MY_MEALS,
            allowedRoles: [ROLE_USER],
          },
          {
            title: "Danh sách món ăn",
            url: ROUTES.DISHES.LIST,
            allowedRoles: [ROLE_USER, ROLE_ADMIN],
          },
          {
            title: "Danh sách nguyên liệu",
            url: ROUTES.INGREDIENTS.LIST,
            allowedRoles: [ROLE_ADMIN],
          },
        ],
      },
    ],
  },
  {
    group: "Cộng đồng",
    children: [
      {
        title: "Cộng đồng",
        icon: Users,
        children: [
          {
            title: "Bảng feed",
            url: ROUTES.COMMUNITY.FEED,
            icon: Users,
            allowedRoles: [ROLE_USER, ROLE_ADMIN],
          },
          {
            title: "Bài viết của tôi",
            url: ROUTES.COMMUNITY.MY_POSTS,
            icon: Users,
            allowedRoles: [ROLE_USER],
          },
        ],
      },
    ],
  },
]
