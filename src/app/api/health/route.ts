import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "ok",
        service: "dolce-vita-api",
        timestamp: new Date().toISOString(),
    });
}
