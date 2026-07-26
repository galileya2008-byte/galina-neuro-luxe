import { supabase } from "@/integrations/supabase/client";

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });

  if (error) {
    console.error("Admin role check failed:", error.message);
    return false;
  }

  return Boolean(data);
}

export function getAuthRedirectUrl(path = "admin-login"): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  return `${window.location.origin}${base}${path.replace(/^\//, "")}`;
}
