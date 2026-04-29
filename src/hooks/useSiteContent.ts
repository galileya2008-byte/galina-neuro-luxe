import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Reads a single site_content row by key. Returns the JSON value as type T,
 * or `defaults` while loading / if the row is missing.
 */
export function useSiteContent<T extends Record<string, any>>(key: string, defaults: T) {
  const [value, setValue] = useState<T>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (cancelled) return;
      if (data?.value) {
        setValue({ ...defaults, ...(data.value as T) });
      }
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { value, loading };
}
