import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditForm from "@/feature/profile/component/EditForm";
import { getUserProfilePromise } from "@/feature/profile/queries";
import { Suspense } from "react";
import EditFormSkeleton from "@/feature/profile/component/EditFormSkeleton";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProfileUI({ params }: PageProps) {
  // DO NOT await params here!
  // Pass the raw `params` promise down so the header shell streams immediately.
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar renders immediately while the form streams */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Profile
        </Link>
        <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
      </div>

      {/* Suspense isolates ALL dynamic runtime reads (params, session, headers) */}
      <Suspense fallback={<EditFormSkeleton />}>
        <EditFormWrapper params={params} />
      </Suspense>
    </div>
  );
}

// All runtime data reads (await params, auth session, DB queries) live strictly inside Suspense
async function EditFormWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Safe to unwrap params inside Suspense
  const { id } = await params;

  // 2. Fetch authenticated session
  const session = await getSession();

  // 3. Guest check
  if (!session?.user) {
    redirect("/");
  }

  // 4. Ownership check: Ensure session user matches target URL ID
  if (session.user.id !== id) {
    redirect(`/profile/${session.user.id}/edit`);
  }

  // 5. Fetch user profile data safely inside Suspense
  const profile = await getUserProfilePromise(id);

  if (!profile) {
    notFound();
  }

  return <EditForm userPromise={profile} />;
}
