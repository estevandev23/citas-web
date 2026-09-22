import styles from "@/styles/auth.module.css";

export function FormStatus({ error, success }: { error?: string; success?: string }) {
  if (error) return <div className={styles.authError} role="alert" tabIndex={-1}>{error}</div>;
  if (success) return <p className={styles.authSuccess} role="status">{success}</p>;
  return null;
}
