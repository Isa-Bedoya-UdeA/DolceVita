import { AppException } from "./app.exception";

export class NotFoundException extends AppException {
    readonly statusCode = 404;
    readonly code = "NOT_FOUND";

    constructor(message: string = "Requested resource was not found") {
        super(message);
    }
}
