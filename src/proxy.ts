import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16: "middleware" đã đổi tên thành "proxy".
// Chạy trước mỗi request để làm mới phiên đăng nhập Supabase và lưu cookie mới.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    }
  );

  // Không chèn code giữa createServerClient và getClaims(),
  // nếu không phiên đăng nhập có thể bị mất ngẫu nhiên.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;
  const { pathname } = request.nextUrl;

  // Chưa đăng nhập mà vào /tasks -> về /login
  if (!isLoggedIn && pathname.startsWith("/tasks")) {
    return redirectWithCookies(request, response, "/login");
  }

  // Đã đăng nhập mà vào /login -> sang /tasks
  if (isLoggedIn && pathname === "/login") {
    return redirectWithCookies(request, response, "/tasks");
  }

  return response;
}

// Giữ lại cookie phiên vừa làm mới khi chuyển hướng
function redirectWithCookies(request: NextRequest, response: NextResponse, path: string) {
  const redirect = NextResponse.redirect(new URL(path, request.url));
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  // Bỏ qua file tĩnh và ảnh
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
