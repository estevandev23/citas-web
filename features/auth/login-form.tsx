"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormStatus } from "@/components/auth/form-status";
import { TextField } from "@/components/auth/field";
import { useAuth } from "@/features/auth/auth-provider";
import { ApiError, login, sessionMe } from "@/lib/api";
import styles from "@/styles/auth.module.css";

export function LoginForm() {
  const router = useRouter(); const { establish } = useAuth(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [errors, setErrors] = useState<Record<string, string>>({}); const [error, setError] = useState(""); const [submitting, setSubmitting] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const next: Record<string, string> = {}; if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) next.email = "Ingresa un correo válido."; if (!password) next.password = "Ingresa tu contraseña."; if (Object.keys(next).length) { setErrors(next); setError("Revisa los campos señalados para continuar."); return; } setSubmitting(true); setError(""); try { const tokens = await login({ email, password }); const session = await sessionMe(tokens.accessToken); establish(tokens, session); setPassword(""); router.replace("/inicio"); } catch (reason) { setPassword(""); setError(reason instanceof ApiError && reason.status === 401 ? "No fue posible iniciar sesión con esos datos." : "No fue posible iniciar sesión. Inténtalo de nuevo."); } finally { setSubmitting(false); } }
  return <form className={styles.authFields} noValidate onSubmit={submit} aria-busy={submitting}><FormStatus error={error} /><TextField id="email" label="Correo electrónico" type="email" autoComplete="email" disabled={submitting} error={errors.email} value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: "" })); }} /><TextField id="password" label="Contraseña" type="password" autoComplete="current-password" disabled={submitting} error={errors.password} value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: "" })); }} /><button className={styles.authButton} disabled={submitting} type="submit">{submitting ? "Ingresando…" : "Ingresar"}</button><p className={styles.authHint}>¿Aún no tienes cuenta? <Link className={styles.authLink} href="/registro">Crea tu cuenta</Link>.</p></form>;
}
