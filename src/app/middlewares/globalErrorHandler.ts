import { NextFunction, Request, Response } from "express";
import { TErrorSources } from "../types/error";
import { handleDuplicateError } from "../errors/handleDuplicateError";
import { handleCastError } from "../errors/handleCastError";
import { handleValidatorError } from "../errors/handleValidationError";
import { handleZodError } from "../errors/handleZodError";
import { AppError } from "../errors/AppError";
import config from "../config";
import { removeImageFromCloudinary } from "../config/cloudinary.config";

export const handleGlobalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Error Occurs";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Opps! Something wrong",
    },
  ];

  if (config.NODE_ENV === "development") {
    console.log(err);
  }
  if (req?.file) {
    await removeImageFromCloudinary(req?.file?.path);
  }

  if (err.code === 11000) {
    const x = handleDuplicateError(err);
    statusCode = x.statusCode;
    message = x.message;
    errorSources = x.errorSources;
  } else if (err.name === "CastError") {
    const x = handleCastError(err);
    statusCode = x.statusCode;
    message = x.message;
    errorSources = x.errorSources;
  } else if (err.name === "ValidationError") {
    const x = handleValidatorError(err);
    statusCode = x.statusCode;
    message = x.message;
    errorSources = x.errorSources;
  } else if (err.name === "ZodError") {
    const x = handleZodError(err);
    statusCode = x.statusCode;
    message = x.message;
    errorSources = x.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === "development" ? err?.stack : "",
  });
};
