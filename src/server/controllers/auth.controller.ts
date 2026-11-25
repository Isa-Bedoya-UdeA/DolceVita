import { NextResponse } from "next/server";
import { AuthService, authService } from "../services/auth.service";
import { RegisteredUserResponseDto } from "../dto/auth/register.dto";
import { ValidationException } from "../exceptions/validation.exception";
import { ApiErrorResponse, ApiResponse } from "../types/api-response.type";
import { toErrorResponse } from "../../lib/utils/error.utils";

export class AuthController {
    constructor(private readonly service: AuthService = authService) {}

    /** POST /api/auth/register — FR-001. Creates the account; the client signs in afterwards. */
    async register(
        req: Request,
    ): Promise<NextResponse<ApiResponse<RegisteredUserResponseDto> | ApiErrorResponse>> {
        try {
            const body = await req.json().catch(() => {
                throw new ValidationException("El cuerpo de la solicitud debe ser JSON válido");
            });
            const user = await this.service.register(body);
            return NextResponse.json({ data: user }, { status: 201 });
        } catch (error) {
            return toErrorResponse(error, "AuthController.register");
        }
    }
}

export const authController = new AuthController();
