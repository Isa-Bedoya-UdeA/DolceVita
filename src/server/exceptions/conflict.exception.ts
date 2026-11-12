import { AppException } from "./app.exception";

export class ConflictException extends AppException {
    readonly statusCode = 409;
    readonly code = "CONFLICT";

    constructor(message: string = "The resource cannot be modified in its current state") {
        super(message);
    }
}
