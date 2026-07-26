export const COOKIE_CONSENT_KEY = "cookie_consent_v1";

export type CookieConsentValue = "accepted" | "declined";

export function getCookieConsent(): CookieConsentValue | null {
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === "accepted" || value === "declined") return value;
  return null;
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === "accepted";
}

export function setCookieConsent(value: CookieConsentValue) {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: value }));
}

export const COOKIE_CONSENT_EVENT = "cookie-consent-change";
