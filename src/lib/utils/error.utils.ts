import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppException } from "../../server/exceptions/app.exception";
import { ValidationException } from "../../server/exceptions/validation.exception";
import { ApiErrorResponse } from "../../server/types/api-response.type";

/** Converts a Zod error into the project's ValidationException format. */
export function toValidationException(error: ZodError): ValidationException {
    const details = error.issues.map((issue) => ({
        field: issue.path.join(".") || undefined,
        message: issue.message,
    }));
    return new ValidationException(details[0]?.message, details);
}

/** Normalizes any thrown error into the standard API error response. */
export function toErrorResponse(error: unknown, context: string): NextResponse<ApiErrorResponse> {
    if (error instanceof ZodError) {
        error = toValidationException(error);
    }

    if (error instanceof AppException) {
        return NextResponse.json(
            {
                error: {
                    code: error.code,
                    message: error.message,
                    ...(error.details ? { details: error.details } : {}),
                },
            },
            { status: error.statusCode },
        );
    }

    console.error(`[${context} Unexpected Error]:`, error);

    return NextResponse.json(
        {
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred while processing the request",
            },
        },
        { status: 500 },
    );
}
