
import { FirebaseError } from "firebase/app";
import { NextApiResponse } from "next";
import { AppError } from "../utils/appError";

export const errorHandler =
  (err: any, res: NextApiResponse) => {

    let statusCode = 500;
    let message = "Internal server error";

    if (err instanceof AppError) {
      statusCode = err.statusCode;
      message = err.message;
    }

    if (err instanceof FirebaseError) {
      statusCode = 400;
      message = err.code;
    } else if (!err.isOperational) {
      console.error("Unhandled error:", err);
    }
    res.status(statusCode).json({
      error: message,
    });

  };
