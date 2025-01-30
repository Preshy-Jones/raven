import createServer from "./utils/createServer";

import http from "http";
import { db } from "./config/database";

const app = createServer();

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

async function testConnection() {
  try {
    await db.raw("SELECT 1");
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

// Start server only after testing database connection
async function startServer() {
  try {
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error("Could not establish database connection. Exiting...");
      process.exit(1);
    }

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

// Handle process termination
process.on("SIGINT", async () => {
  try {
    await db.destroy();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing database connection:", error);
    process.exit(1);
  }
});

startServer();
