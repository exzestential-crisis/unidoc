"use client";
import GuestHome from "@/components/home/GuestHome";
import UserHome from "@/components/home/UserHome";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = supabaseBrowserClient;

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        return;
      }
      setSession(data.session);
    };

    fetchSession();
  }, [supabase]);

  if (!session) return <GuestHome />;

  return <UserHome />;
}
