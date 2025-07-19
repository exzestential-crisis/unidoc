import GuestHome from "@/components/home/GuestHome";
import UserHome from "@/components/home/UserHome";
import { createServerSupabaseClient } from "../../utils/supabase/server";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <GuestHome />;

  return <UserHome />;
}
