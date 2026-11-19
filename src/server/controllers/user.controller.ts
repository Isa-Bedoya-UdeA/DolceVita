import { NextResponse } from "next/server";
import { AuthGuard } from "../auth/guards/auth.guard";
import { Role } from "../domain/enums/role.enum";
import { CurrentUserResponseDto } from "../dto/user/user-response.dto";
import { toErrorResponse } from "../../lib/utils/error.utils";

export class UserController {
    /** GET /api/users/me — identity of the current session, used by the UI to show admin options. */
    async me(req: Request): Promise<NextResponse> {
        try {
            const user = await AuthGuard.authenticate(req);
            const data: CurrentUserResponseDto = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: String(user.role).toUpperCase() === Role.ADMIN ? Role.ADMIN : Role.USER,
            };
            return NextResponse.json({ data }, { status: 200 });
        } catch (error) {
            return toErrorResponse(error, "UserController.me");
        }
    }
}

export const userController = new UserController();
