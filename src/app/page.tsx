"use client";

import GuestHome from "@/components/home/GuestHome";
import UserHome from "@/components/home/UserHome";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient(); // create a browser client on the fly

  useEffect(() => {
    // Fetch initial session
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        return;
      }
      setSession(data.session);
    };

    fetchSession();

    // Listen for auth state changes (optional, keeps session in sync)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!session) return <GuestHome />;

  return <UserHome />;
}
