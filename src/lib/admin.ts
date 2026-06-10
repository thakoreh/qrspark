type AdminEnv = {
  QRFORGE_ADMIN_EMAIL?: string;
  QRFORGE_ADMIN_EMAILS?: string;
  [key: string]: string | undefined;
};

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || "";
}

export function adminEmailsFromEnv(env: AdminEnv = process.env) {
  return [env.QRFORGE_ADMIN_EMAIL, env.QRFORGE_ADMIN_EMAILS]
    .flatMap((value) => (value || "").split(","))
    .map(normalizeEmail)
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null, env: AdminEnv = process.env) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return adminEmailsFromEnv(env).includes(normalized);
}
