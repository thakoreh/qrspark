"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, inputClass } from "@/components/ui";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  async function magicLink() {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { toast.success("Demo mode active. Add Supabase env vars to send magic links."); setLoading(false); return; }
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
    setLoading(false);
    if (error) toast.error(error.message); else toast.success("Magic link sent. Check your inbox.");
  }
  async function google() {
    const supabase = createClient();
    if (!supabase) { toast.success("Demo mode active. Add Supabase env vars for Google OAuth."); return; }
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } });
  }
  return <div className="grid gap-3"><Field label="Work email"><input className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" type="email" /></Field><Button disabled={loading || !email} onClick={magicLink}>{loading ? "Sending..." : "Email magic link"}</Button><button onClick={google} className="min-h-10 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold transition active:scale-[0.98] dark:border-white/10 dark:bg-zinc-900">Continue with Google</button></div>;
}
