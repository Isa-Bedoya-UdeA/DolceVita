import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    const { id } = await params;
    return NextResponse.json({ message: `Get conversation ${id}` });
}

export async function PATCH(request: Request, { params }: RouteParams) {
    const { id } = await params;
    return NextResponse.json({ message: `Update conversation ${id}` });
}

export async function DELETE(request: Request, { params }: RouteParams) {
    const { id } = await params;
    return NextResponse.json({ message: `Delete conversation ${id}` });
}
