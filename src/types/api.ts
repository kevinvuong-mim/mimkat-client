interface ApiResponse<T = any> {
  data: T;
  path: string;
  message: string;
  success: boolean;
  timestamp: string;
  statusCode: number;
}

interface ErrorResponse {
  path: string;
  error: string;
  stack?: string;
  success: false;
  message: string;
  timestamp: string;
  statusCode: number;
  errors?: ValidationError[];
}

interface ValidationError {
  value?: any;
  field: string;
  message: string;
}

interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    total: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type { ApiResponse, ErrorResponse, ValidationError, PaginatedResponse };
