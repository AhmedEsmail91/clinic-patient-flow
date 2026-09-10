import { cookies } from "next/headers";
import { API_BASE_URL } from "./config";

// Server Components run on the Next.js server, a separate origin from the
// browser - the incoming request's cookies are NOT automatically attached
// to any fetch() a Server Component makes to the Backend, so the auth
// cookie has to be forwarded by hand.
export function serverFetch(path: string, init?: RequestInit) {
  const token = cookies().get("token")?.value;
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Cookie: `token=${token}` } : {}),
    },
    cache: "no-store",
  });
}
