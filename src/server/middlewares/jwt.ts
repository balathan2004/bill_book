import jwt from "jsonwebtoken";
import { JwtRequest, User } from "../utils/interfaces";
import { AppError } from "../utils/appError";
import { NextApiResponse } from "next";

const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY as string;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY as string;

export const withJwt = (handler: (req: JwtRequest, res: NextApiResponse) => Promise<void>) => async (req: JwtRequest, res: NextApiResponse) => {

    const authHeader = req.headers.authorization || ""
    const token = authHeader.split(" ")[1];

    const user = verifyJwtToken(token, "access");
    req.user = user;
    handler(req, res);

}

export const verifyJwtToken = (token: string | null, type: "access" | "refresh") => {

    if (!token) throw new AppError("No token provided", 401);

    let data: User | null = null;

    const secret = type === "access" ? JWT_ACCESS_KEY : JWT_REFRESH_KEY;

    try {
        const result = jwt.verify(token, secret) as User;
        data = result;
        return data;
    } catch (err) {
        throw new AppError("Invalid Auth Token", 401);
    }

}


export function generateAccessToken(user: User) {
    return jwt.sign(user, JWT_ACCESS_KEY, { expiresIn: "60M" });
}

export function generateRefreshToken(user: User) {
    return jwt.sign(user, JWT_REFRESH_KEY, { expiresIn: "15D" });
}

