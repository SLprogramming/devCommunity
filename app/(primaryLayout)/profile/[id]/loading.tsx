import { ProfileSkeleton } from "@/feature/profile/component/UserData";
import React from "react";

const Loading = () => {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
      <ProfileSkeleton />
    </div>
  );
};

export default Loading;
