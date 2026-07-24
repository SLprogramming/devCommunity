import { Suspense } from "react";

import UserData, {
  ProfileSkeleton,
} from "@/feature/profile/component/UserData";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DevUserProfile({ params }: PageProps) {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4">
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
