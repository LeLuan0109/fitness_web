import { MyPosts } from "@/components/features/community/MyPosts"
import { PageLayout } from "@/layouts/PageLayout"

export const MyPostsPage = () => {
  return (
    <PageLayout title="Bài viết của tôi">
      <MyPosts />
    </PageLayout>
  )
}
