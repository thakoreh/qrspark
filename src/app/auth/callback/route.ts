import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/utils";

export async function GET() {
  return NextResponse.redirect(absoluteUrl("/dashboard"));
}
