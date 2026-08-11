import { getPopularPostIds } from "@/feature/post/queries";
import { notFound } from "next/navigation";

import PostDetailData from "@/feature/post/component/PostDetailData";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const postIds = await getPopularPostIds();
  return postIds.map((id) => ({
    id,
  }));
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!id) return notFound();

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        <PostDetailData id={id} />
      </div>
    </div>
  );
}
