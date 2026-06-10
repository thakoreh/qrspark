import { NextResponse } from "next/server";

function dataUrlToBlob(dataUrl: string) {
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) throw new Error("QR image must be a base64 data URL");
  const [, mime, base64] = match;
  return new Blob([Buffer.from(base64, "base64")], { type: mime || "image/png" });
}

export async function POST(request: Request) {
  try {
    const { prompt, qr } = await request.json();
    if (!qr) return NextResponse.json({ error: "Missing QR image" }, { status: 400 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ imageUrl: qr, demo: true, prompt, note: "No AI provider key is configured. QR fallback returned." });
    }

    const form = new FormData();
    form.append("model", "gpt-image-1");
    form.append("image", dataUrlToBlob(qr), "qrspark-qr.png");
    form.append("size", "1024x1024");
    form.append("quality", "low");
    form.append("prompt", [
      "Create a polished artistic QR code campaign image while preserving QR scan reliability.",
      "Keep the QR geometry readable, high contrast, centered, and unobstructed.",
      "Do not crop the QR code. Keep quiet margin around the QR.",
      `Requested style: ${prompt || "branded campaign poster"}.`,
    ].join(" "));

    const res = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("openai_image_edit_failed", { status: res.status, body: text.slice(0, 500) });
      return NextResponse.json({ imageUrl: qr, demo: true, prompt, note: `AI image request failed (${res.status}). QR fallback returned.` });
    }

    const json = JSON.parse(text);
    const b64 = json.data?.[0]?.b64_json;
    const url = json.data?.[0]?.url;
    const imageUrl = b64 ? `data:image/png;base64,${b64}` : url;
    if (!imageUrl) return NextResponse.json({ imageUrl: qr, demo: true, prompt, note: "AI provider returned no image. QR fallback returned." });

    return NextResponse.json({ imageUrl, demo: false, prompt, note: "Generated with OpenAI gpt-image-1." });
  } catch (error) {
    console.error("ai_art_route_failed", error);
    return NextResponse.json({ error: "AI art generation failed" }, { status: 500 });
  }
}
