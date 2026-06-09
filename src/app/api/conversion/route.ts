import { NextResponse } from "next/server";
export async function POST(request: Request) { const event = await request.json(); console.log(JSON.stringify({ event: "conversion", ...event, at: new Date().toISOString() })); return NextResponse.json({ ok: true }); }
