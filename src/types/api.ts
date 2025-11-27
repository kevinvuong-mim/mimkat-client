export interface ApiResponse<T = any> {
  data: T;
  path: string;
  message: string;
  success: boolean;
  timestamp: string;
  statusCode: number;
}
