import app from "../server/app.js";
import { ensureDatabaseTables } from "../server/db/index.js";

let tablesEnsured = false;

export default async function handler(req, res) {
  if (!tablesEnsured) {
    try {
      await ensureDatabaseTables();
      tablesEnsured = true;
    } catch (e) {
      console.error("[Vercel Handler] Error ensuring tables:", e);
    }
  }
  return app(req, res);
}
