import CreatePostForm from "@/feature/post/component/CreatePostForm";
import CreatePostCardSkeleton from "@/feature/post/component/CreatePostFormSkeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React, { Suspense } from "react";

function page() {
  return (
    <div>
      <Suspense fallback={<CreatePostCardSkeleton />}>
        <InternalWarper />
      </Suspense>
    </div>
  );
}

async function InternalWarper() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = {
    id: session?.user?.id || "",
    name: session?.user?.name || "",
    image: session?.user?.image || "",
  };
  return (
    <>
      <CreatePostForm user={user} />
    </>
  );
}

export default page;
