// ProfileButtonsWrapper.tsx (Server Component - NO "use client")
import ProfileButtons from "./ProfileButtons";

export default async function ProfileButtonsWrapper({
  userId,
}: {
  userId: string;
}) {
  return <ProfileButtons userId={userId} />;
}
