import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ messageId: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
    const { messageId } = await params;
    return NextResponse.json({ message: `Submit feedback for message ${messageId}` });
}
