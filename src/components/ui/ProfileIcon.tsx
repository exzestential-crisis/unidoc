"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function ProfileIcon() {
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
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!session)
    return (
      <Link className="text-center font-bold px-4 text-lg" href={"/login"}>
        <p>Login</p>
      </Link>
    );
}
