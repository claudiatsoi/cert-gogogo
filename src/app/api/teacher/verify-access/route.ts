import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    const expectedCode = process.env.TEACHER_ACCESS_CODE;
    if (!expectedCode) {
      return NextResponse.json(
        { ok: false, error: "Teacher access is not configured on server." },
        { status: 500 },
      );
    }

    if (typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Access code is required." },
        { status: 400 },
      );
    }

    const valid = code.trim() === expectedCode;
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Invalid teacher access code." },
        { status: 403 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to verify teacher access code." },
      { status: 500 },
    );
  }
}
