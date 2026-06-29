export const AUTH_COOKIE = "dash_auth";

export function setAuthCookie(username: string) {
  if (typeof document === "undefined") return;

  // biome-ignore lint/suspicious/noDocumentCookie: auth demo via client cookie for proxy gate
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(username)}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;

  // biome-ignore lint/suspicious/noDocumentCookie: auth demo via client cookie for proxy gate
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function isAuthenticated(): boolean {
  if (typeof document === "undefined") return false;

  return document.cookie
    .split(";")
    .some((entry) => entry.trim().startsWith(`${AUTH_COOKIE}=`));
}
