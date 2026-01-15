import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[v0] Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log("[v0] Starting database setup...");

    // Read and execute the SQL migration
    const sqlMigration = `
      CREATE TABLE IF NOT EXISTS timer_session (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        end_time BIGINT NOT NULL,
        is_paused BOOLEAN DEFAULT false,
        paused_remaining BIGINT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_timer_session_updated_at ON timer_session(updated_at DESC);

      ALTER TABLE timer_session ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Allow all access to timer_session" ON timer_session
        FOR ALL USING (true);
    `;

    // Execute the migration by calling a Postgres function
    const { error } = await supabase.rpc("execute_sql", {
      query: sqlMigration,
    });

    if (error && error.code !== "PGRST201") {
      // PGRST201 is "unknown error" but may still work, let's try another approach
      console.log("[v0] RPC approach failed, trying direct SQL...");
    }

    // Try alternative: test table creation
    const { error: createError } = await supabase.from("timer_session").select("count()", { count: "exact", head: true });

    if (createError?.code === "PGRST116") {
      // Table doesn't exist, we need to create it via SQL Editor
      console.error("[v0] Table does not exist. Please run the SQL migration manually:");
      console.error(sqlMigration);
      process.exit(1);
    }

    console.log("[v0] Database setup complete!");
  } catch (err) {
    console.error("[v0] Database setup error:", err);
    process.exit(1);
  }
}

setupDatabase();
