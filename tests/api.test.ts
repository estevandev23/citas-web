import { afterEach, describe, expect, it, vi } from "vitest";
import { login, register, sessionMe } from "../lib/api";

describe("cliente REST de autenticación", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("envía el registro al API configurable sin exponer la contraseña en la respuesta", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 1, firstName: "Ana", lastName: "Demo", email: "ana@demo.invalid", roles: ["USER"] }), { status: 201, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await register({ firstName: "Ana", lastName: "Demo", documentType: "CC", documentNumber: "1", email: "ana@demo.invalid", phone: "3000000000", password: "no-se-expone" });
    expect(result).toMatchObject({ id: 1, roles: ["USER"] });
    expect(result).not.toHaveProperty("password");
    expect(fetchMock).toHaveBeenCalledWith("http://api.test/api/v1/auth/register", expect.objectContaining({ method: "POST" }));
  });

  it("normaliza el error de credenciales sin inspeccionar datos sensibles", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ code: "INVALID_CREDENTIALS", message: "Invalid credentials" }), { status: 401, headers: { "Content-Type": "application/json" } })));
    await expect(login({ email: "ana@demo.invalid", password: "incorrecta" })).rejects.toMatchObject({ status: 401, payload: { code: "INVALID_CREDENTIALS" } });
  });

  it("usa únicamente access token en el encabezado del recurso protegido", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ userId: 1, roles: ["USER"] }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    await sessionMe("access-token-de-prueba");
    expect(fetchMock).toHaveBeenCalledWith("http://api.test/api/v1/session/me", expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer access-token-de-prueba" }) }));
  });
});
