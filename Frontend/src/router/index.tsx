import { RouterProvider } from "react-router-dom"

import { router } from "@/router/router.tsx"

export default function AppRouter() {
  return <RouterProvider router={router} />
}
