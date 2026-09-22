export type RegisterRequest = { firstName: string; lastName: string; documentType: string; documentNumber: string; email: string; phone: string; password: string };
export type RegisteredUser = { id: number; firstName: string; lastName: string; email: string; roles: string[] };
export type LoginRequest = { email: string; password: string };
export type TokenResponse = { accessToken: string; refreshToken: string; tokenType: "Bearer" };
export type SessionView = { userId: number; roles: string[] };
export type ApiErrorPayload = { code?: string; message?: string; fields?: string[] };

export class ApiError extends Error { constructor(public readonly status: number, public readonly payload: ApiErrorPayload = {}) { super(payload.message || "No fue posible completar la solicitud."); } }
const apiUrl = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl()}${path}`, { ...init, headers: { Accept: "application/json", ...init.headers } });
  const body = await response.json().catch(() => undefined);
  if (!response.ok) throw new ApiError(response.status, body);
  return body as T;
}

export const register = (payload: RegisterRequest) => request<RegisteredUser>("/api/v1/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
export const login = (payload: LoginRequest) => request<TokenResponse>("/api/v1/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
export const sessionMe = (accessToken: string) => request<SessionView>("/api/v1/session/me", { headers: { Authorization: `Bearer ${accessToken}` } });
