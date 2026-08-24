import NetworkPage from "@/feature/follow/component/NetworkData";
import { getFollowers, getFollowing } from "@/feature/follow/queries";
import { getSession } from "@/lib/get-session";
const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const followers = await getFollowers(id);
  const following = await getFollowing(id);
  const session = await getSession();
  const isSelf = session?.user?.id === id;
  console.log("hello");
  return (
    <>
      <NetworkPage
        followers={followers}
        following={following || []}
        isSelf={isSelf}
      />
    </>
  );
};

export default page;
