import { PostDataSkeleton } from "@/feature/post/component/PostDetailData";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <PostDataSkeleton />
        </div>
      </div>
    </>
  );
};

export default Loading;
