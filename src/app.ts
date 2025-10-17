import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleGlobalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import { rootRouter } from "./app/routes";
import "./app/config/passport";
const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/v1", rootRouter);
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Server is running successfully",
  });
});

app.use(handleGlobalErrorHandler);
app.use(notFound);

export default app;
