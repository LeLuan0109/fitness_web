import { createBrowserRouter, Navigate } from "react-router-dom"

import { GuestRoute } from "@/components/shared/routes/GuestRoute"
import { ProtectedRoute } from "@/components/shared/routes/ProtectedRoute"
import { RolePage } from "@/components/shared/routes/RolePage"
import { ROLE_ADMIN, ROLE_USER } from "@/constants/roles.constant"
import { ROUTES } from "@/constants/routes"
import AppLayout from "@/layouts/AppLayout"
import { lazyImport } from "@/lib/lazy-import"
import {
  AdminMenuCreatePage,
  AdminMenuEditPage,
  AdminSampleMenuDetailPage,
  AdminSampleMenuListPage,
} from "@/pages/admin/nutrition/AdminMenuPages"
import {
  AdminSampleWorkoutListPage,
  AdminWorkoutCreatePage,
  AdminWorkoutDetailPage,
  AdminWorkoutEditPage,
} from "@/pages/admin/workouts/AdminWorkoutPages"
import { AdminChangePasswordPage } from "@/pages/auth/AdminChangePasswordPage"
import { UserChangePasswordPage } from "@/pages/auth/UserChangePasswordPage"
import { AdminCommunityFeedPage } from "@/pages/community/AdminCommunityFeedPage"
import { AdminPostDetailPage } from "@/pages/community/AdminPostDetailPage"
import { UserCommunityFeedPage } from "@/pages/community/UserCommunityFeedPage"
import { UserPostDetailPage } from "@/pages/community/UserPostDetailPage"
import { AdminDishesDetailPage } from "@/pages/dishes/AdminDishesDetailPage"
import { AdminDishesListPage } from "@/pages/dishes/AdminDishesListPage"
import { UserDishesDetailPage } from "@/pages/dishes/UserDishesDetailPage"
import { UserDishesListPage } from "@/pages/dishes/UserDishesListPage"
import { AdminExerciseDetailPage } from "@/pages/exercises/AdminExerciseDetailPage"
import { AdminExerciseListPage } from "@/pages/exercises/AdminExerciseListPage"
import { UserExerciseDetailPage } from "@/pages/exercises/UserExerciseDetailPage"
import { UserExerciseListPage } from "@/pages/exercises/UserExerciseListPage"
import { IngredientListPage } from "@/pages/ingredients/IngredientListPage"
import { IngredientCreatePage } from "@/pages/ingredients/IngredientCreatePage"
import { IngredientEditPage } from "@/pages/ingredients/IngredientEditPage"
import { AdminProfilePage } from "@/pages/profile/AdminProfilePage"
import { UserProfilePage } from "@/pages/profile/UserProfilePage"
import {
  UserMenuCreatePage,
  UserMenuEditPage,
  UserSampleMenuDetailPage,
  UserSampleMenuListPage,
} from "@/pages/user/nutrition/UserMenuPages"
import {
  UserSampleWorkoutListPage,
  UserWorkoutCreatePage,
  UserWorkoutDetailPage,
  UserWorkoutEditPage,
} from "@/pages/user/workouts/UserWorkoutPages"
const { UserListPage } = lazyImport(() => import("@/pages/user/UserListPage"), "UserListPage")
const { MyPostsPage } = lazyImport(() => import("@/pages/community/MyPostsPage"), "MyPostsPage")
const { ForgotPasswordPage } = lazyImport(() => import("@/pages/auth/ForgotPasswordPage"), "ForgotPasswordPage")
const { AdminDashboardPage } = lazyImport(() => import("@/pages/dashboard/AdminDashboardPage"), "AdminDashboardPage")
const { ForbiddenPage } = lazyImport(() => import("@/pages/errors/ForbiddenPage"), "ForbiddenPage")
const { DishCreatePage } = lazyImport(() => import("@/pages/nutrition/DishCreatePage"), "DishCreatePage")
const { DishEditPage } = lazyImport(() => import("@/pages/nutrition/DishEditPage"), "DishEditPage")
const { MyMenuDetailPage } = lazyImport(() => import("@/pages/nutrition/MyMenuDetailPage"), "MyMenuDetailPage")
const { MyMenuPage } = lazyImport(() => import("@/pages/nutrition/MyMenuPage"), "MyMenuPage")
const { MyWorkoutListPage } = lazyImport(() => import("@/pages/workouts/MyWorkoutListPage"), "MyWorkoutListPage")
const { ExerciseCreatePage } = lazyImport(() => import("@/pages/exercises/ExerciseCreatePage"), "ExerciseCreatePage")
const { ExerciseEditPage } = lazyImport(() => import("@/pages/exercises/ExerciseEditPage"), "ExerciseEditPage")
const { OnboardingPage } = lazyImport(() => import("@/pages/onboarding/OnboardingPage"), "OnboardingPage")
const { LoginPage } = lazyImport(() => import("@/pages/auth/Login"), "LoginPage")
const { RegisterPage } = lazyImport(() => import("@/pages/auth/Register"), "RegisterPage")
const { Dashboard } = lazyImport(() => import("@/pages/dashboard/DashboardPage"), "Dashboard")
const { SimpleTablePage } = lazyImport(() => import("@/pages/table/simple-table-page"), "SimpleTablePage")
const { SelectedTablePage } = lazyImport(() => import("@/pages/table/selected-table-page"), "SelectedTablePage")
const { HistoryPage } = lazyImport(() => import("@/pages/history/HistoryPage"), "HistoryPage")
const { ProgressPage } = lazyImport(() => import("@/pages/progress/ProgressPage"), "ProgressPage")
const { FoodDiaryPage } = lazyImport(() => import("@/pages/nutrition/FoodDiaryPage"), "FoodDiaryPage")

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.TABLE.SIMPLE,
        element: (
          <GuestRoute>
            <SimpleTablePage />
          </GuestRoute>
        ),
      },
      {
        path: ROUTES.TABLE.SELECTED,
        element: (
          <ProtectedRoute>
            <SelectedTablePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminProfilePage />} user={<UserProfilePage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.AUTH.CHANGE_PASSWORD,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminChangePasswordPage />} user={<UserChangePasswordPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.EXERCISES.LIST,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_USER]}>
            <RolePage admin={<AdminExerciseListPage />} user={<UserExerciseListPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.EXERCISES.DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_USER]}>
            <RolePage admin={<AdminExerciseDetailPage />} user={<UserExerciseDetailPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.EXERCISES.CREATE,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <ExerciseCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.EXERCISES.EDIT,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <ExerciseEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.WORKOUTS.SAMPLE_LIST,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminSampleWorkoutListPage />} user={<UserSampleWorkoutListPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.WORKOUTS.MY_LIST,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER]}>
            <MyWorkoutListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.WORKOUTS.DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminWorkoutDetailPage />} user={<UserWorkoutDetailPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.WORKOUTS.CREATE,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminWorkoutCreatePage />} user={<UserWorkoutCreatePage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.WORKOUTS.EDIT,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminWorkoutEditPage />} user={<UserWorkoutEditPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.HISTORY,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER]}>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PROGRESS,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER]}>
            <ProgressPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.NUTRITION.SAMPLE,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminSampleMenuListPage />} user={<UserSampleMenuListPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.NUTRITION.MY_MEALS,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER]}>
            <MyMenuPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.NUTRITION.DIARY,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER]}>
            <FoodDiaryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.NUTRITION.SAMPLE_DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminSampleMenuDetailPage />} user={<UserSampleMenuDetailPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.NUTRITION.MY_MEALS_DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER]}>
            <MyMenuDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.NUTRITION.CREATE_MENU,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminMenuCreatePage />} user={<UserMenuCreatePage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.NUTRITION.EDIT_MENU,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminMenuEditPage />} user={<UserMenuEditPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DISHES.LIST,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminDishesListPage />} user={<UserDishesListPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DISHES.DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminDishesDetailPage />} user={<UserDishesDetailPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DISHES.CREATE,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <DishCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DISHES.EDIT,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <DishEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.INGREDIENTS.LIST,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <IngredientListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.INGREDIENTS.CREATE,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <IngredientCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.INGREDIENTS.EDIT,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <IngredientEditPage />
          </ProtectedRoute>
        ),
      },
      // Admin Dashboard
      {
        path: ROUTES.ADMIN.DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN.USERS,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <UserListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.COMMUNITY.FEED,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminCommunityFeedPage />} user={<UserCommunityFeedPage />} />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.COMMUNITY.MY_POSTS,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER]}>
            <MyPostsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.COMMUNITY.POST_DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <RolePage admin={<AdminPostDetailPage />} user={<UserPostDetailPage />} />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: ROUTES.FORBIDDEN,
    element: <ForbiddenPage />,
  },
  {
    path: ROUTES.AUTH.LOGIN,
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: ROUTES.AUTH.REGISTER,
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: ROUTES.AUTH.FORGOT_PASSWORD,
    element: (
      <GuestRoute>
        <ForgotPasswordPage />
      </GuestRoute>
    ),
  },
  {
    path: ROUTES.ONBOARDING,
    element: (
      <ProtectedRoute requireOnboarding={false}>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    // Mọi đường dẫn không khớp -> điều hướng về trang đăng nhập.
    path: "*",
    element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
  },
])
