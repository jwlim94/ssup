import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/actions/profile";
import { ROUTES } from "@/lib/constants";
import EditProfileForm from "./EditProfileForm";

export default async function EditProfilePage() {
  const { data: profile, error } = await getMyProfile();

  if (error || !profile) {
    redirect(ROUTES.LOGIN);
  }

  return <EditProfileForm initialProfile={profile} />;
}
