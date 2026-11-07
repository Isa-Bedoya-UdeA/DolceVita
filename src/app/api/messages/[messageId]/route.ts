import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ messageId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    const { messageId } = await params;
    return NextResponse.json({ message: `Get message ${messageId}` });
}

export async function PATCH(request: Request, { params }: RouteParams) {
    const { messageId } = await params;
    return NextResponse.json({ message: `Edit message ${messageId}` });
}
