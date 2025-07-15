// app/api/current-user/route.ts
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null, error: "Unable to fetch user" }, { status: 500 });
  }
}
