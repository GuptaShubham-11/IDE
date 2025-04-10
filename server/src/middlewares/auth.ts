import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.js";

interface AuthenticatedRequest extends Request {
    user?: any;
}

interface DecodedToken extends JwtPayload {
    _id: string;
}

export const verifyJWT = asyncHandler(
    async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
        try {
            const token =
                req.cookies?.accessToken ||
                req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                throw new ApiError(401, "Unauthorized request");
            }

            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as DecodedToken;

            const user = await User.findById(decodedToken?._id).select(
                "-password -refreshToken"
            );


            if (!user) {
                throw new ApiError(401, "Invalid Access Token!");
            }

            req.user = user;

            next();
        } catch (error: any) {

            throw new ApiError(401, error?.message || "Invalid Access Token!");
        }
    }
);
