import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Connection", () => {
  it("should connect to Supabase with valid credentials", async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Check that environment variables are set
    expect(supabaseUrl).toBeDefined();
    expect(supabaseAnonKey).toBeDefined();
    expect(supabaseServiceKey).toBeDefined();

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Test connection by checking if we can access the database
    const { data, error } = await supabase.from("_test_connection").select("*").limit(1);
    
    // We expect either data or a "relation does not exist" error (which means connection works)
    // A connection failure would give a different error
    if (error) {
      // "relation does not exist" means connection succeeded but table doesn't exist - that's OK
      expect(error.message).toMatch(/relation.*does not exist|does not exist|permission denied|not found|Could not find the table/i);
    }
    
    // The client should be created successfully
    expect(supabase).toBeDefined();
  });

  it("should have valid URL format", () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    expect(supabaseUrl).toMatch(/^https:\/\/.*\.supabase\.co$/);
  });
});
