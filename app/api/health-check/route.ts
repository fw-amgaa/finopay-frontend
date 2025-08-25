import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  const timestamp = Date.now();
  const url = `${process.env.NEXT_PUBLIC_HYPERSWITCH_URL}/health`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    const status = res.ok ? "good" : "bad";
    const message = res.ok ? undefined : `HTTP ${res.status}: ${text}`;

    await convex.mutation(api.healthCheck.writeResult, {
      status,
      timestamp,
      message,
    });

    return NextResponse.json({ status, message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    await convex.mutation(api.healthCheck.writeResult, {
      status: "bad",
      timestamp,
      message,
    });

    return NextResponse.json({ status: "bad", message }, { status: 500 });
  }
}
