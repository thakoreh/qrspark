import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt, qr } = await request.json();
  if (!qr) return NextResponse.json({ error: "Missing QR image" }, { status: 400 });
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: new FormData() });
    if (!res.ok) return NextResponse.json({ imageUrl: qr, demo: true, prompt, note: "AI provider rejected edit request. QR fallback returned." });
  }
  if (process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ imageUrl: qr, demo: false, prompt, note: "Replicate token detected. Wire preferred Flux model in this route for paid generation." });
  }
  return NextResponse.json({ imageUrl: qr, demo: true, prompt, note: "Demo mode returns the original scan-safe QR image. Connect an AI provider before claiming generated QR art." });
}
