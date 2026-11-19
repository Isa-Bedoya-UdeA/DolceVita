import { connection } from "next/server";
import { adminController } from "@/server/controllers/admin.controller";

interface RouteParams {
    params: Promise<{ userId: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    await connection();
    const { userId } = await params;
    return adminController.getUser(req, userId);
}

export async function PATCH(req: Request, { params }: RouteParams) {
    const { userId } = await params;
    return adminController.updateUserRole(req, userId);
}
