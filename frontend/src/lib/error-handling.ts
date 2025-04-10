export interface ApiError {
  statusCode: number;
  message: string;
  code: string;
  details?: any;
  timestamp?: string;
  path?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string,
    public details?: any,
    public timestamp?: string,
    public path?: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  static fromResponse(response: Response, data: any): ApiError {
    return new ApiError(
      response.status,
      data.message || "An error occurred",
      data.code || "UNKNOWN_ERROR",
      data.details,
      data.timestamp,
      data.path
    );
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(500, error.message, "INTERNAL_ERROR");
  }

  return new ApiError(500, "An unexpected error occurred", "UNKNOWN_ERROR");
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

export function getValidationErrors(
  error: unknown
): Record<string, string[]> | null {
  if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
    return error.details;
  }
  return null;
}
