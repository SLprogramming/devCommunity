import PostManage from "@/feature/post/component/PostManage";
import { getTotalPostsByUserId } from "@/feature/post/queries";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}
const page = async (props: PageProps) => {
  const { id } = await props.params;
  const totalPosts = await getTotalPostsByUserId(id);
  const session = await getSession();
  if (session?.user?.id !== id) {
    return redirect(`/profile/${id}`);
  }
  return (
    <div>
      <PostManage postArray={totalPosts} />
    </div>
  );
};

export default page;
