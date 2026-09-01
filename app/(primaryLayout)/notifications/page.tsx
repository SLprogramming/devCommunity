import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { getNotificationsForUser } from "@/feature/notification/queries";
import { NotificationPage } from "@/feature/notification/component/NotificationPage";

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const initial = await getNotificationsForUser(session.user.id);
  return <NotificationPage initial={initial} />;
}
