import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Get assistant config" });
}

export async function PATCH() {
    return NextResponse.json({ message: "Update assistant config" });
}
