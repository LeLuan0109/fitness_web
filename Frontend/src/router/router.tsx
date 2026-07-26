import { createBrowserRouter, Navigate } from "react-router-dom"

import { GuestRoute } from "@/components/shared/routes/GuestRoute"
import { ProtectedRoute } from "@/components/shared/routes/ProtectedRoute"
import { ROLE_ADMIN, ROLE_USER } from "@/constants/roles.constant"
import { ROUTES } from "@/constants/routes"
import AppLayout from "@/layouts/AppLayout"
import { lazyImport } from "@/lib/lazy-import"
import { IngredientListPage } from "@/pages/ingredients/IngredientListPage"
import { IngredientCreatePage } from "@/pages/ingredients/IngredientCreatePage"
import { IngredientEditPage } from "@/pages/ingredients/IngredientEditPage"
const { UserListPage } = lazyImport(() => import("@/pages/user/UserListPage"), "UserListPage")
const { CommunityFeedPage } = lazyImport(() => import("@/pages/community/CommunityFeedPage"), "CommunityFeedPage")
const { MyPostsPage } = lazyImport(() => import("@/pages/community/MyPostsPage"), "MyPostsPage")
const { PostDetailPage } = lazyImport(() => import("@/pages/community/PostDetailPage"), "PostDetailPage")
const { ForgotPasswordPage } = lazyImport(() => import("@/pages/auth/ForgotPasswordPage"), "ForgotPasswordPage")
const { AdminDashboardPage } = lazyImport(() => import("@/pages/dashboard/AdminDashboardPage"), "AdminDashboardPage")
const { DishesDetailPage } = lazyImport(() => import("@/pages/dishes/DishesDetailPage"), "DishesDetailPage")
const { DishesListPage } = lazyImport(() => import("@/pages/dishes/DishesListPage"), "DishesListPage")
const { ForbiddenPage } = lazyImport(() => import("@/pages/errors/ForbiddenPage"), "ForbiddenPage")
const { DishCreatePage } = lazyImport(() => import("@/pages/nutrition/DishCreatePage"), "DishCreatePage")
const { DishEditPage } = lazyImport(() => import("@/pages/nutrition/DishEditPage"), "DishEditPage")
const { MenuCreatePage } = lazyImport(() => import("@/pages/nutrition/MenuCreatePage"), "MenuCreatePage")
const { MenuEditPage } = lazyImport(() => import("@/pages/nutrition/MenuEditPage"), "MenuEditPage")
const { MyMenuDetailPage } = lazyImport(() => import("@/pages/nutrition/MyMenuDetailPage"), "MyMenuDetailPage")
const { MyMenuPage } = lazyImport(() => import("@/pages/nutrition/MyMenuPage"), "MyMenuPage")
const { SampleMenuDetailPage } = lazyImport(
  () => import("@/pages/nutrition/SampleMenuDetailPage"),
  "SampleMenuDetailPage",
)
const { SampleMenuPage } = lazyImport(() => import("@/pages/nutrition/SampleMenuPage"), "SampleMenuPage")
const { MyWorkoutListPage } = lazyImport(() => import("@/pages/workouts/MyWorkoutListPage"), "MyWorkoutListPage")
const { WorkoutCreatePage } = lazyImport(() => import("@/pages/workouts/WorkoutCreatePage"), "WorkoutCreatePage")
const { WorkoutEditPage } = lazyImport(() => import("@/pages/workouts/WorkoutEditPage"), "WorkoutEditPage")
const { ProfilePage } = lazyImport(() => import("@/pages/profile/ProfilePage"), "ProfilePage")
const { ChangePasswordPage } = lazyImport(() => import("@/pages/auth/ChangePasswordPage"), "ChangePasswordPage")
const { ExerciseDetailPage } = lazyImport(() => import("@/pages/exercises/ExerciseDetailPage"), "ExerciseDetailPage")
const { ExerciseListPage } = lazyImport(() => import("@/pages/exercises/ExerciseListPage"), "ExerciseListPage")
const { ExerciseCreatePage } = lazyImport(() => import("@/pages/exercises/ExerciseCreatePage"), "ExerciseCreatePage")
const { ExerciseEditPage } = lazyImport(() => import("@/pages/exercises/ExerciseEditPage"), "ExerciseEditPage")
const { OnboardingPage } = lazyImport(() => import("@/pages/onboarding/OnboardingPage"), "OnboardingPage")
const { WorkoutDetailPage } = lazyImport(() => import("@/pages/workouts/WorkoutDetailPage"), "WorkoutDetailPage")
const { WorkoutListPage } = lazyImport(() => import("@/pages/workouts/SampleWorkoutListPage"), "WorkoutListPage")
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
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.AUTH.CHANGE_PASSWORD,
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.EXERCISES.LIST,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_USER]}>
            <ExerciseListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.EXERCISES.DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_USER]}>
            <ExerciseDetailPage />
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
            <WorkoutListPage />
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
            <WorkoutDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.WORKOUTS.CREATE,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <WorkoutCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.WORKOUTS.EDIT,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <WorkoutEditPage />
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
            <SampleMenuPage />
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
            <SampleMenuDetailPage />
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
            <MenuCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.NUTRITION.EDIT_MENU,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <MenuEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DISHES.LIST,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <DishesListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DISHES.DETAIL,
        element: (
          <ProtectedRoute allowedRoles={[ROLE_USER, ROLE_ADMIN]}>
            <DishesDetailPage />
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
            <CommunityFeedPage />
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
            <PostDetailPage />
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
