// Bỏ dấu "/" thừa ở cuối VITE_REACT_APP_API_URL để tránh URL "//api" (gây lỗi CORS/403).
export const API_BASE_URL = (import.meta.env.VITE_REACT_APP_API_URL ?? "").replace(/\/+$/, "") + "/api"
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_SECRET
export const FACEBOOK_APP_ID = import.meta.env.VITE_REACT_APP_FACEBOOK_APP_ID

export const API_ENDPOINTS = {
  DASHBOARD: "/recommendations/:userId",
  AUTH: {
    LOGIN: "/auth/login",
    GOOGLE_LOGIN: "/auth/google",
    FACEBOOK_LOGIN: "/auth/facebook",
    LOGOUT: "/auth/logout",
    BASIC_INFO: "/auth/me",
    REFRESH: "/auth/refresh",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  USER: {
    ALL: "/user/all",
    CHANGE_PASSWORD: "/user/change-password",
    PROFILE: "/user/profile",
    ONBOARDING: "/user/onboarding",
    BAN: "/user/:id/status",
  },
  EXERCISE: {
    LIST: "/exercises",
    DETAIL: "/exercises/:id",
    CREATE: "/exercises",
    UPDATE: "/exercises/:id",
    DELETE: "/exercises/:id",
    RELATED: "/exercises/:id/related",
    SELECT_OPTIONS: "/exercises/select-options",
    DETAIL_FORM: "/exercises/form/:id",
  },
  MUSCLE_GROUP: {
    SELECT_OPTIONS: "/muscle-group/select-options",
  },
  TRAINING_TYPE: {
    SELECT_OPTIONS: "/training-type/select-options",
  },
  WORKOUT_PLANS: {
    SAMPLE: "/workout-plan/samples",
    MINE: "/workout-plan/mine",
    DETAIL: "/workout-plan/:id",
    CREATE: "/workout-plan",
    UPDATE: "/workout-plan/:id",
    DELETE: "/workout-plan/:id",
    COPY: "/workout-plan/:id/copy",
    ACTIVE_STATUS: "/workout-plan/:id/active-status",
    OUTSTANDING: "/workout-plan/outstanding",
    SUGGEST_LABELS: "/workout-plan/suggest-labels",
  },
  WORKOUT_LOGS: {
    LOG_SET: "/workout-logs",
    HISTORY: "/workout-logs/history",
    STATS: "/workout-logs/statistics",
    LOGGED_EXERCISES: "/workout-logs/logged-exercises",
    PROGRESS: "/workout-logs/progress/:exerciseId",
    SESSIONS: "/workout-logs/sessions",
    SESSION_DETAIL: "/workout-logs/session-detail",
  },
  NOTIFICATIONS: {
    REGISTER_TOKEN: "/notifications/register-token",
    LIST: "/notifications",
    MARK_READ: "/notifications/:id/read",
    COUNT_UNREAD: "/notifications/unread/count",
  },
  EQUIPMENT: {
    SELECT_OPTIONS: "/equipment/select-options",
  },
  DISHES: {
    LIST: "/dishes",
    DETAIL: "/dishes/:id",
    CREATE: "/dishes",
    UPDATE: "/dishes/:id",
    DELETE: "/dishes/:id",
  },
  FOOD_LOGS: {
    LIST: "/food-logs",
    ADD: "/food-logs",
    DELETE: "/food-logs/:id",
    SUMMARY: "/food-logs/summary",
    DIARY_CALENDAR: "/food-logs/diary-calendar",
    DAY_DETAIL: "/food-logs/day-detail",
  },
  PROGRESS: {
    OVERVIEW: "/progress/overview",
    WEIGHT: "/progress/weight",
    CHECKIN: "/progress/checkin",
    CALENDAR: "/progress/calendar",
    DAY_DETAIL: "/progress/day-detail",
  },
  INGREDIENTS: {
    LIST: "/ingredients",
    DETAIL: "/ingredients/:id",
    CREATE: "/ingredients",
    UPDATE: "/ingredients/:id",
    SELECT_OPTIONS: "/ingredients/select-options",
    UNIT: "/ingredients/units",
  },
  MENUS: {
    SAMPLE: "/menus/public",
    PERSONAL: "/menus/my-menus",
    DETAIL: "/menus/:id",
    CREATE: "/menus",
    UPDATE: "/menus/:id",
    DELETE: "/menus/:id",
    COPY: "/menus/:id/clone",
  },
  COMMON: {
    FITNESS_GOALS_OPTIONS: "/common/fitness-goals/select-options",
  },
  FORUM: {
    POSTS: "/posts",
    MY_POSTS: "/user/posts",
    POST_DETAIL: "/posts/:id",
    CREATE_POST: "/posts",
    UPDATE_POST: "/posts/:id",
    DELETE_POST: "/posts/:id",
    LIKE_POST: "/posts/:id/post-like",
    GET_COMMENTS: "/posts/:id/comments",
  },
  COMMENTS: {
    GET_DETAIL: "/comments/:id",
    CREATE: "/comments",
    EDIT: "/comments/:id",
    DELETE: "/comments/:id",
    LIKE: "/comments/:id/comment-like",
  },
  CHATBOT: {
    CHAT: "/chat/:userId",
    ANALYZE: "/chat/:userId/analyze",
  },
  ADMIN_DASHBOARD: {
    STATS: "/admin/dashboard/stats",
    USER_GROWTH: "/admin/dashboard/chart/users",
    USER_GOAL: "/admin/dashboard/chart/goals",
  },
}

export const API_STATUS = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  ERR_NETWORK: "ERR_NETWORK",
}

export const ERROR_FORBIDDEN_MESSAGE = "Forbidden"
