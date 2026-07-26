import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  COOKIE_CONSENT_EVENT,
  hasAnalyticsConsent,
} from "@/lib/cookieConsent";

declare global {
  interface Window {
    ym?: (...args: any[]) => void;
    [key: string]: any;
  }
}

let loadedId: string | null = null;

const loadMetrika = (id: string) => {
  if (loadedId === id) return;
  loadedId = id;

  (function (m: any, e: any, t: any, r: any, i: any, k?: any, a?: any) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = +new Date();
    for (let j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  window.ym!(Number(id), "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
};

const YandexMetrika = () => {
  const location = useLocation();
  const [consentGranted, setConsentGranted] = useState(hasAnalyticsConsent);

  useEffect(() => {
    const sync = () => setConsentGranted(hasAnalyticsConsent());
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!consentGranted || location.pathname.startsWith("/admin")) return;

    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "yandex_metrika_id")
          .maybeSingle();
        const id = data?.value?.trim();
        if (cancelled || !id) return;
        loadMetrika(id);
      } catch {
        // silent
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [consentGranted]);

  useEffect(() => {
    if (!consentGranted || location.pathname.startsWith("/admin")) return;
    if (loadedId && window.ym) {
      window.ym(Number(loadedId), "hit", window.location.href, {
        title: document.title,
        referer: document.referrer,
      });
    }
  }, [location.pathname, consentGranted]);

  return null;
};

export default YandexMetrika;
