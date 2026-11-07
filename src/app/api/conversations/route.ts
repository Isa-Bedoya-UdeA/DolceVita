import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "List conversations" });
}

export async function POST() {
    return NextResponse.json({ message: "Create conversation" });
}
