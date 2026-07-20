import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renamed "middleware" to "proxy" and recommends keeping this layer
// thin — refresh the auth session and do lightweight redirects only. The actual
// admin-role check (which requires a DB lookup) lives in `src/app/admin/layout.tsx`
// as a Server Component guard instead of here, per Next.js 16's guidance to keep
// heavy auth logic out of the network boundary.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshes the session cookie if it's expired — required so Server Components
  // (which read cookies but can't write them) always see a valid session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Lightweight redirect only: "is anyone logged in at all". The admin-vs-staff-vs-
  // customer role check happens in the admin layout itself (see comment above).
  if ((pathname.startsWith("/admin") || pathname.startsWith("/account")) && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
