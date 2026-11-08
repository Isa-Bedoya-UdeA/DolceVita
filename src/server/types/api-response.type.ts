export interface ApiResponse<T> {
    data: T;
}

export interface ApiErrorDetail {
    field?: string;
    message: string;
}

export interface ApiError {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
}

export interface ApiErrorResponse {
    error: ApiError;
}
