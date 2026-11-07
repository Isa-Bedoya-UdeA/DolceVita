import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ userId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    const { userId } = await params;
    return NextResponse.json({ message: `Get user ${userId}` });
}

export async function PATCH(request: Request, { params }: RouteParams) {
    const { userId } = await params;
    return NextResponse.json({ message: `Update user ${userId}` });
}

export async function DELETE(request: Request, { params }: RouteParams) {
    const { userId } = await params;
    return NextResponse.json({ message: `Delete user ${userId}` });
}
