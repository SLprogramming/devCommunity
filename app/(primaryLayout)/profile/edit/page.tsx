
import Image from "next/image";
import {  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import EditForm from "@/feature/profile/component/EditForm";
import { getUserProfilePromise } from "@/feature/profile/queries";
import { Suspense } from "react";
import EditFormSkeleton from "@/feature/profile/component/EditFormSkeleton";


export default  function EditProfileUI() {
  const userProfile =  getUserProfilePromise();
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Profile
        </Link>
        <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
      </div>
      <Suspense fallback={<EditFormSkeleton/>}>

      <EditForm userPromise={userProfile} />
      </Suspense>

    </div>
  );
}