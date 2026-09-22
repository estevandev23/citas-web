import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import styles from "@/styles/auth.module.css";

type Common = { id: string; label: string; error?: string };
export function TextField({ id, label, error, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${id}-error`;
  return <div className={styles.authField}><label className={styles.authLabel} htmlFor={id}>{label}</label><input id={id} className={styles.authInput} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />{error && <span id={errorId} className={styles.authFieldError}>{error}</span>}</div>;
}
export function SelectField({ id, label, error, children, ...props }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  const errorId = `${id}-error`;
  return <div className={styles.authField}><label className={styles.authLabel} htmlFor={id}>{label}</label><select id={id} className={styles.authInput} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props}>{children}</select>{error && <span id={errorId} className={styles.authFieldError}>{error}</span>}</div>;
}
