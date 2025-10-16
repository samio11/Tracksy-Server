import { Response } from "express";

interface IMeta {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
}

interface ISendResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T[] | T | null;
  meta?: IMeta;
}

export const sendResponse = <T>(res: Response, data: ISendResponse<T>) => {
  res.status(data?.statusCode).json({
    success: true,
    message: data?.message,
    data: data?.data,
    meta: data?.meta,
  });
};
