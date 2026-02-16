export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
