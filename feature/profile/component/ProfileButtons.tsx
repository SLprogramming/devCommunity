"use client";
import { useCurrentUser } from "@/lib/get-current-user";
import Link from "next/link";

const ProfileButtons = ({ userId }: { userId: string }) => {
  const user = useCurrentUser();
  const ownProfile = userId === user?.id;
  return (
    <>
      {ownProfile ? (
        <Link
          href={`/profile/${user?.id}/edit`}
          className="text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-4 py-2 rounded-xl transition-colors sm:mt-4 self-stretch sm:self-auto text-center"
        >
          Edit Profile
        </Link>
      ) : (
        <Link
          href={`/profile/${user?.id}/edit`}
          className="text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-4 py-2 rounded-xl transition-colors sm:mt-4 self-stretch sm:self-auto text-center"
        >
          Follow
        </Link>
      )}
    </>
  );
};

export default ProfileButtons;
