"use client";
import { useCurrentUser } from "@/lib/get-current-user";
import Link from "next/link";

const ProfileButtons = ({ userId }: { userId: string }) => {
  const user = useCurrentUser();
  const ownProfile = userId === user?.id;
  return (
    <>
      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-4">
        {ownProfile ? (
          <>
            <Link
              href={`/profile/${user?.id}/manage`}
              className="flex-1 sm:flex-initial text-center text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-3 sm:px-4 py-2 rounded-xl transition-colors shrink-0"
            >
              Manage Posts
            </Link>
            <Link
              href={`/profile/${user?.id}/edit`}
              className="flex-1 sm:flex-initial text-center text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-3 sm:px-4 py-2 rounded-xl transition-colors shrink-0"
            >
              Edit Profile
            </Link>
          </>
        ) : (
          <Link
            href={`/profile/${user?.id}/edit`}
            className="w-full sm:w-auto text-center text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-4 py-2 rounded-xl transition-colors shrink-0"
          >
            Follow
          </Link>
        )}
      </div>
    </>
  );
};

export default ProfileButtons;
