import Link from "next/link";
import styles from "./maintenance.module.css";

export const metadata = {
  title: "JITTOK — Maintenance",
  description: "JITTOK is getting ready for the next drop.",
};

export default function MaintenancePage() {
  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <section className={styles.card}>
        <img
          src="/jittok-logo.png"
          alt="JITTOK"
          className={styles.logo}
        />

        <p className={styles.eyebrow}>Store temporarily offline</p>

        <h1>Preparing the next drop.</h1>

        <p className={styles.copy}>
          We are making a few final improvements. JITTOK will be back shortly.
        </p>

        <div className={styles.loader} aria-label="Maintenance in progress">
          <span />
        </div>

        <p className={styles.note}>Too loud to blend in.</p>

        <Link href="/admin/login" className={styles.adminLink}>
          Admin access
        </Link>
      </section>
    </main>
  );
}
