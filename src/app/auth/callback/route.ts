import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Handles the redirect back from Google (and any other OAuth provider) after
// the user approves sign-in. Supabase sends a `code` query param here which
// we exchange for a session cookie, then send the user on their way.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const explicitRedirect = searchParams.get("redirect");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      let isAdminOrStaff = false;
      if (data.user) {
        const { data: profile } = await supabase.from("users").select("role").eq("id", data.user.id).single();
        isAdminOrStaff = !!profile && ["admin", "staff"].includes(profile.role);
      }

      const destination = isAdminOrStaff
        ? explicitRedirect && explicitRedirect.startsWith("/admin")
          ? explicitRedirect
          : "/admin"
        : explicitRedirect && !explicitRedirect.startsWith("/admin")
          ? explicitRedirect
          : "/account";

      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  // Something went wrong (missing/invalid code, provider error) — send them
  // back to login with a flag the page can use to show an error toast.
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
