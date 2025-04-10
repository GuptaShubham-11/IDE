import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import User, { IUser } from "../models/user";

// Optional: You can define a proper User type
interface DecodedToken extends JwtPayload {
    _id: string;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export const verifyJWT = asyncHandler(
    async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized. No token provided.");
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as DecodedToken;

            const user = await User.findById(decoded._id).select("-password -refreshToken");

            if (!user) {
                throw new ApiError(401, "Invalid access token.");
            }

            req.user = user;
            next();
        } catch (error: any) {
            throw new ApiError(401, "Token verification failed.");
        }
    }
);
