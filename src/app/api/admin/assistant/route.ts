import { connection } from "next/server";
import { adminController } from "@/server/controllers/admin.controller";

export async function GET(req: Request) {
    await connection();
    return adminController.getAssistant(req);
}

export async function PATCH(req: Request) {
    return adminController.updateAssistant(req);
}
