import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  console.error("Requires SUPABASE_SERVICE_ROLE_KEY in environment or .env");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf("=");
      const key = line.slice(0, i);
      let value = line.slice(i + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      return [key, value];
    }),
);

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const url = env.VITE_SUPABASE_URL;

if (!serviceRoleKey || !url) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL");
  console.error("Get service role key from Supabase → Project Settings → API");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: created, error: createError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (createError) {
  console.error("Failed to create user:", createError.message);
  process.exit(1);
}

const userId = created.user?.id;
if (!userId) {
  console.error("User created but no id returned");
  process.exit(1);
}

const { error: roleError } = await supabase.from("user_roles").insert({
  user_id: userId,
  role: "admin",
});

if (roleError) {
  console.error("User created but admin role failed:", roleError.message);
  process.exit(1);
}

console.log(`Admin created: ${email}`);
console.log(`User id: ${userId}`);
console.log("Login at /admin-login");
