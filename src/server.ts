import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import { redisConnection } from "./app/config/redis.config";
let server: Server;

async function startServer() {
  try {
    await mongoose.connect(config.DATABASE as string);
    server = app.listen(config.PORT, () => {
      console.log(`Server runs on port :- ${config.PORT}✨`);
    });
  } catch (err) {
    console.log("Internal server error", err);
  }
}

(async () => {
  await startServer();
  await redisConnection();
})();

process.on("uncaughtException", (err) => {
  console.log("UnCaught Exception", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("UnHandled Rejection", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("Signal Termination");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
