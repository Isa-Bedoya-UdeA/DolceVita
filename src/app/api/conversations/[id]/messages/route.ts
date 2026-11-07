import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params;
    return NextResponse.json({ message: `List messages for conversation ${id}` });
}

export async function POST(request: Request, { params }: RouteParams) {
    const { id } = await params;
    return NextResponse.json({ message: `Create message in conversation ${id}` });
}
