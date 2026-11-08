import { AppException, ErrorDetail } from "./app.exception";

export class ValidationException extends AppException {
    readonly statusCode = 400;
    readonly code = "VALIDATION_ERROR";

    constructor(message: string = "The request contains invalid fields", details?: ErrorDetail[]) {
        super(message, details);
    }
}
