import CreatePostForm from "@/feature/post/component/CreatePostForm";
import CreatePostCardSkeleton from "@/feature/post/component/CreatePostFormSkeleton";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function Page() {
  return (
    <div>
      <Suspense fallback={<CreatePostCardSkeleton />}>
        <InternalWarper />
      </Suspense>
    </div>
  );
}

async function InternalWarper() {
  const session = await getSession();
  if (!session) redirect("/");
  return (
    <>
      <CreatePostForm />
    </>
  );
}

export default Page;
