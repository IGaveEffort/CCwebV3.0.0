import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "./lib/rate-limit";

export const config = {
  matcher: ["/api/:path*"],
};

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `mw:${req.nextUrl.pathname}:${ip}`;
  const rl = await enforceRateLimit(key);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }
  return NextResponse.next();
}
