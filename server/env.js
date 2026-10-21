import { existsSync } from "node:fs";

// Load local configuration before other server modules read process.env.
if (existsSync(".env")) {
  process.loadEnvFile(".env");
}
