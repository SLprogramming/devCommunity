import { Suspense } from "react";

import UserData, {
  ProfileSkeleton,
} from "@/feature/profile/component/UserData";
import { getPopularUserIds } from "@/feature/profile/queries";
import { getSession } from "@/lib/get-session";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const userIds = await getPopularUserIds();
  return userIds.map((id) => ({
    id,
  }));
}

export default async function DevUserProfile({ params }: PageProps) {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
      <Suspense fallback={<ProfileSkeleton />}>
        <InternalWarper params={params} />
      </Suspense>
    </div>
  );
}

async function InternalWarper({ params }: PageProps) {
  const { id } = await params;
  return (
    <>
      <UserData userId={id} />
    </>
  );
}
