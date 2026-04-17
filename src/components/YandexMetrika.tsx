import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

  // Official Yandex.Metrika snippet (inlined)
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

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;

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
  }, []);

  // SPA hit on route change
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    if (loadedId && window.ym) {
      window.ym(Number(loadedId), "hit", window.location.href, {
        title: document.title,
        referer: document.referrer,
      });
    }
  }, [location.pathname]);

  return null;
};

export default YandexMetrika;
