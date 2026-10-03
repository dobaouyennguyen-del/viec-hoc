import { createBrowserClient, createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Dùng trong Client Component ("use client")
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}

// Dùng trong Server Component, Server Action và Route Handler.
// Tạo client mới cho mỗi request, không dùng chung giữa các request.
export async function createServerSupabaseClient() {
  // Import động để file này vẫn import được từ Client Component
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component không được ghi cookie — bỏ qua nếu đã có
          // proxy/middleware làm mới phiên đăng nhập.
        }
      },
    },
  });
}
