import Link from "next/link";
import type { ReactNode } from "react";
import styles from "@/styles/auth.module.css";

export function AuthLayout({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return <main className={styles.authShell}><header className={styles.authHeader}><Link className={styles.brand} href="/iniciar-sesion">Citas ficticias</Link><span className={styles.environment}>Laboratorio académico</span></header><div className={styles.authGrid}><section className={styles.authCard} aria-labelledby="auth-title"><h1 id="auth-title" className={styles.authTitle}>{title}</h1><p className={styles.authLead}>{lead}</p>{children}</section><aside className={styles.authAside}><p className={styles.eyebrow}>Tu espacio</p><h2>Información clara, paso a paso.</h2><p>Este entorno usa datos sintéticos y te acompaña en la gestión de citas del ejercicio.</p></aside></div></main>;
}
