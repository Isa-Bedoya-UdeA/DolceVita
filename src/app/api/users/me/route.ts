import { connection } from "next/server";
import { userController } from "@/server/controllers/user.controller";

export async function GET(req: Request) {
    await connection();
    return userController.me(req);
}
