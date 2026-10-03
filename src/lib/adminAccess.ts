import { onIdTokenChanged, type Auth, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const ADMIN_EMAIL = "jittokofficial@gmail.com";

// Keep this allowlist aligned with firestore.rules. Rules enforce access even
// when a caller bypasses the UI. Unverified email ownership never grants access.
export async function isAdmin(user: User): Promise<boolean> {
  const token = await user.getIdTokenResult();
  return token.claims.email === ADMIN_EMAIL && token.claims.email_verified === true;
}

export async function requireAdmin(): Promise<User> {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user || !(await isAdmin(user))) {
    throw new Error("This account does not have JITTOK admin access.");
  }
  return user;
}

export function onAdminStateChanged(
  instance: Auth,
  next: (user: User | null) => void | Promise<void>,
  error?: (error: Error) => void,
) {
  let version = 0;
  const unsubscribe = onIdTokenChanged(instance, (user) => {
    const current = ++version;
    void (async () => {
      try {
        const allowed = user ? await isAdmin(user) : false;
        if (current === version) await next(allowed ? user : null);
      } catch (reason) {
        if (current !== version) return;
        error?.(reason instanceof Error ? reason : new Error("Access check failed."));
        await next(null);
      }
    })();
  });
  return () => { version++; unsubscribe(); };
}
