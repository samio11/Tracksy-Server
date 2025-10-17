import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import "./app/config/passport";
import { handleGlobalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
const app: Application = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Server is running successfully",
  });
});

app.use(handleGlobalErrorHandler);
app.use(notFound);

export default app;
