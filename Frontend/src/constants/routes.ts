export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    CHANGE_PASSWORD: "/change-password",
    FORGOT_PASSWORD: "/forgot-password",
  },

  ONBOARDING: "/onboarding",
  PROFILE: "/profile",
  EXAMPLE: "/example",
  TABLE: {
    SIMPLE: "/simple-table",
    SELECTED: "/selected-table",
  },
  TASK: {
    LIST: "/list-task",
    DETAIL: "/tasks/:id",
    EDIT: "/edit-task/:id",
    CREATE: "/create-task",
  },
  SUPPLIER: {
    MANAGE: "/supplier",
    DETAIL: "/supplier/detail",
    CREATE: "/supplier/create",
  },
  EXERCISES: {
    LIST: "/exercises",
    DETAIL: "/exercises/:id",
    CREATE: "/exercises/create",
    EDIT: "/exercises/edit/:id",
  },
  WORKOUTS: {
    SAMPLE_LIST: "/sample-workouts",
    MY_LIST: "/my-workouts",
    DETAIL: "/workouts/:id",
    CREATE: "/workouts/create",
    EDIT: "/workouts/edit/:id",
  },
  HISTORY: "/history",
  PROGRESS: "/progress",
  NUTRITION: {
    SAMPLE: "/nutrition/sample-meals",
    SAMPLE_DETAIL: "/nutrition/sample-meals/:id",
    MY_MEALS: "/nutrition/my-meals",
    MY_MEALS_DETAIL: "/nutrition/my-meals/:id",
    DIARY: "/nutrition/diary",
    CREATE_MENU: "/nutrition/menu/create",
    EDIT_MENU: "/nutrition/menu/edit/:id",
  },
  DISHES: {
    LIST: "/dishes",
    DETAIL: "/dishes/:id",
    CREATE: "/dishes/create",
    EDIT: "/dishes/edit/:id",
  },
  COMMUNITY: {
    FEED: "/community/feed",
    POST_DETAIL: "/community/posts/:id",
    CREATE_POST: "/community/create-post",
    MY_POSTS: "/community/my-posts",
  },
  FORBIDDEN: "/403",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
  },
  INGREDIENTS: {
    LIST: "/ingredients",
    CREATE: "/ingredients/create",
    EDIT: "/ingredients/edit/:id",
  },
} as const
