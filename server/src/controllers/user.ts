import User from "../models/user";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import signUpValidation from "../schemas/signUp";

const generateAccessAndRefreshTokens = async (userId: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Server error generating access and refresh tokens.");
    }
};

const signUp = asyncHandler(async (req, res) => {
    // Validate request body
    const validatedData = signUpValidation.safeParse(req.body);

    if (!validatedData.success) {
        const formattedErrors = validatedData.error.format();

        // Extract only error messages
        const errorMessages = Object.values(formattedErrors)
            .map(error => (error as any)._errors?.join(", "))
            .filter(Boolean) // Remove empty values
            .join(", ");

        throw new ApiError(400, errorMessages || "Invalid data");
    }

    const { name, email, password } = validatedData.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists with this email.");
    }

    // Create new user
    const newUser = await User.create({ name, email, password });

    // Respond with user data and token
    res.status(200).json(new ApiResponse(200, "User registered successfully", {
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        }
    }));
});

export {
    signUp
};

