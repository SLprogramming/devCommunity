import { getPopularPostIds } from "@/feature/post/queries";
import { notFound } from "next/navigation";

import { Suspense } from "react";
import PostDetailData, {
  PostDataSkeleton,
} from "@/feature/post/component/PostDetailData";
import { getSession } from "@/lib/get-session";

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
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Suspense fallback={<PostDataSkeleton />}>
          <InternalWarper id={id} />
        </Suspense>
      </div>
    </div>
  );
}

async function InternalWarper({ id }: { id: string }) {
  const session = await getSession();
  return (
    <>
      <PostDetailData
        id={id}
        userId={session?.user?.id}
        userImage={session?.user?.image || null}
      />
    </>
  );
}
