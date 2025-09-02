import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const allowedOrigin = "*";
  res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  return res;
}
