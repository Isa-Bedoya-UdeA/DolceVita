import { AppException } from "./app.exception";

export class ForbiddenException extends AppException {
    readonly statusCode = 403;
    readonly code = "FORBIDDEN";

    constructor(message: string = "You do not have permission to access this resource") {
        super(message);
    }
}
