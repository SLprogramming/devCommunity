import React, { Suspense } from "react";

import UserData, {
  ProfileSkeleton,
} from "@/feature/profile/component/UserData";
import { getSession } from "@/lib/get-session";

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
  const session = await getSession();
  const ownProfile = session?.user?.id === id;
  return (
    <>
      <UserData userId={id} ownProfile={ownProfile} />
    </>
  );
}
