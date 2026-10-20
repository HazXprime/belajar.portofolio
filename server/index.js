import app from "./app.js";
import { ensureDatabaseTables } from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT) || 5000;

async function startServer() {
  try {
    await ensureDatabaseTables();
    console.log("[DB] Tables ensured.");

    const server = app.listen(PORT, () => {
      console.log(`[Server] Portfolio API running on http://localhost:${PORT}`);
    });

    const gracefulShutdown = () => {
      console.log("[Server] Shutting down gracefully...");
      server.close(() => {
        console.log("[Server] Closed remaining connections.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (err) {
    console.error("[Server] Fatal startup error:", err);
    process.exit(1);
  }
}

startServer();
