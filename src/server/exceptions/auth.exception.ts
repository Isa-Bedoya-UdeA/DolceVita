import { AppException } from "./app.exception";

export class UnauthorizedException extends AppException {
    readonly statusCode = 401;
    readonly code = "UNAUTHORIZED";

    constructor(message: string = "Authentication is required to access this resource") {
        super(message);
    }
}
