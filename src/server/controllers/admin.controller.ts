import { NextResponse } from "next/server";
import { RoleGuard } from "../auth/guards/role.guard";
import { UserService, userService } from "../services/user.service";
import { AssistantService, assistantService } from "../services/assistant.service";
import { StatisticsService, statisticsService } from "../services/statistics.service";
import { toErrorResponse } from "../../lib/utils/error.utils";

/** Administrative endpoints (API-012 to API-015). Every method validates the ADMIN role first. */
export class AdminController {
    constructor(
        private readonly users: UserService = userService,
        private readonly assistant: AssistantService = assistantService,
        private readonly statistics: StatisticsService = statisticsService,
    ) {}

    /** GET /api/admin/users */
    async listUsers(req: Request): Promise<NextResponse> {
        try {
            await RoleGuard.requireAdmin(req);
            const data = await this.users.listUsers();
            return NextResponse.json({ data }, { status: 200 });
        } catch (error) {
            return toErrorResponse(error, "AdminController.listUsers");
        }
    }

    /** GET /api/admin/users/[userId] */
    async getUser(req: Request, userId: string): Promise<NextResponse> {
        try {
            await RoleGuard.requireAdmin(req);
            const data = await this.users.getUser(userId);
            return NextResponse.json({ data }, { status: 200 });
        } catch (error) {
            return toErrorResponse(error, "AdminController.getUser");
        }
    }

    /** PATCH /api/admin/users/[userId] */
    async updateUserRole(req: Request, userId: string): Promise<NextResponse> {
        try {
            const admin = await RoleGuard.requireAdmin(req);
            const body = await req.json().catch(() => ({}));
            const data = await this.users.updateRole(admin.id, userId, body);
            return NextResponse.json({ data }, { status: 200 });
        } catch (error) {
            return toErrorResponse(error, "AdminController.updateUserRole");
        }
    }

    /** GET /api/admin/assistant */
    async getAssistant(req: Request): Promise<NextResponse> {
        try {
            await RoleGuard.requireAdmin(req);
            const data = await this.assistant.getAdminConfig();
            return NextResponse.json({ data }, { status: 200 });
        } catch (error) {
            return toErrorResponse(error, "AdminController.getAssistant");
        }
    }

    /** PATCH /api/admin/assistant */
    async updateAssistant(req: Request): Promise<NextResponse> {
        try {
            await RoleGuard.requireAdmin(req);
            const body = await req.json().catch(() => ({}));
            const data = await this.assistant.updateAdminConfig(body);
            return NextResponse.json({ data }, { status: 200 });
        } catch (error) {
            return toErrorResponse(error, "AdminController.updateAssistant");
        }
    }

    /** GET /api/admin/statistics */
    async getStatistics(req: Request): Promise<NextResponse> {
        try {
            await RoleGuard.requireAdmin(req);
            const data = await this.statistics.getStatistics();
            return NextResponse.json({ data }, { status: 200 });
        } catch (error) {
            return toErrorResponse(error, "AdminController.getStatistics");
        }
    }
}

export const adminController = new AdminController();
