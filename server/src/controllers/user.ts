import User from "../models/user";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import ZodErrorFormater from "../utils/ZodErrorFormater";
import signUpValidation from "../schemas/signUp";
import signInValidation from "../schemas/signIn";

const generateAccessAndRefreshTokens = async (userId: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Ensure these methods exist in your User model
        if (typeof user.generateAccessToken !== "function" || typeof user.generateRefreshToken !== "function") {
            throw new ApiError(500, "Token generation methods are missing from User model");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        if (!accessToken || !refreshToken) {
            throw new ApiError(500, "Failed to generate tokens");
        }

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token Generation Error:", error);
        throw new ApiError(500, "Server error generating access and refresh tokens.");
    }
};


const signUp = asyncHandler(async (req, res) => {
    // Validate request body
    const validatedData = signUpValidation.safeParse(req.body);

    if (!validatedData.success) {
        const errorMessages = ZodErrorFormater(validatedData);
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

const signIn = asyncHandler(async (req, res) => {
    // Validate request body
    const validatedData = signInValidation.safeParse(req.body);

    if (!validatedData.success) {
        const errorMessages = ZodErrorFormater(validatedData);
        throw new ApiError(400, errorMessages || "Invalid credentials");
    }

    const { email, password } = validatedData.data;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Invalid credentials");
    }

    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is incorrect");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id as string);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: true };

    // Respond with user data and token
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, "User logged in successfully", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken
        }));
});

export {
    signUp,
    signIn
};

