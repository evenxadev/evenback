export type UserRole = "admin" | "customer" | "event_manager";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}