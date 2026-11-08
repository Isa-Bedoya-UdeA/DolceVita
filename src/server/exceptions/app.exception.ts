export interface ErrorDetail {
    field?: string;
    message: string;
}

export abstract class AppException extends Error {
    abstract readonly statusCode: number;
    abstract readonly code: string;
    readonly details?: ErrorDetail[];

    constructor(message: string, details?: ErrorDetail[]) {
        super(message);
        this.name = this.constructor.name;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
