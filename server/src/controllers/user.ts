import User from '../models/user';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import ZodErrorFormater from '../utils/ZodErrorFormater';
import signUpValidation from '../schemas/signUp';
import signInValidation from '../schemas/signIn';
import {
  emailVerificationValidation,
  emailValidation,
} from '../schemas/emailVarification';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middlewares/auth';
import { sendOtpOnEmail } from '../helpers/sendOtpOnEmail';
import { canResendOtp } from '../utils/RateLimiter';
import { changePasswordValidation } from '../schemas/changePassword';
import VerifyEmail from '../emails/VerifyEmail';
import ForgetPasswordEmail from '../emails/ForgetPasswordEmail';

const generateAccessAndRefreshTokens = async (
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, 'Failed to generate tokens');
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token Generation Error:', error);
    throw new ApiError(
      500,
      'Server error generating access and refresh tokens.'
    );
  }
};

const signUp = asyncHandler(async (req, res) => {
  // Validate request body
  const validatedData = signUpValidation.safeParse(req.body);

  if (!validatedData.success) {
    const errorMessages = ZodErrorFormater(validatedData);
    throw new ApiError(400, errorMessages || 'Invalid data');
  }

  const { name, email, password } = validatedData.data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.verified) {
    throw new ApiError(400, 'User already exists with this email.');
  } else if (existingUser && !existingUser.verified) {
    existingUser.name = name;
    existingUser.password = password;
    existingUser.save({ validateBeforeSave: false });
    res.status(200).json(
      new ApiResponse(200, 'User registered successfully', {
        user: {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
        },
      })
    );
    return;
  }

  // Create new user
  const newUser = await User.create({ name, email, password });

  // Respond with user data and token
  res.status(200).json(
    new ApiResponse(200, 'User registered successfully', {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  );
});

const signIn = asyncHandler(async (req, res) => {
  // Validate request body
  const validatedData = signInValidation.safeParse(req.body);

  if (!validatedData.success) {
    const errorMessages = ZodErrorFormater(validatedData);
    throw new ApiError(400, errorMessages || 'Invalid credentials');
  }

  const { email, password } = validatedData.data;

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, 'Invalid credentials');
  }

  // Check if password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, 'Password is incorrect');
  }

  // Check if user is verified
  if (!user.verified) {
    user.otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save({ validateBeforeSave: false });

    // Send email verification
    try {
      const title = 'Your OTP For Verification';
      await sendOtpOnEmail(
        title,
        user.email,
        VerifyEmail({ name: user.name, otp: user.otp })
      );
    } catch (error: any) {
      throw new ApiError(
        500,
        error.message || 'Failed to send verification email'
      );
    }

    res.status(200).json(
      new ApiResponse(
        200,
        'User logged in successfully. Please verify your email',
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            verified: user.verified,
          },
        }
      )
    );

    return;
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id as string
  );

  const options = { httpOnly: true, secure: true };

  // Respond with user data and token
  res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(200, 'User logged in successfully', {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          verified: user.verified,
        },
      })
    );
});

const reSendVerificationEmail = asyncHandler(async (req, res) => {
  // Validate request body
  const validatedData = emailValidation.safeParse(req.body);

  if (!validatedData.success) {
    const errorMessages = ZodErrorFormater(validatedData);
    throw new ApiError(400, errorMessages || 'Invalid data');
  }

  const { email } = validatedData.data;

  // Rate limit check
  const { canSend, retryAfter } = canResendOtp(email);

  if (!canSend) {
    throw new ApiError(
      429,
      `Too many requests. Please try again after ${retryAfter} minutes.`
    );
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  // Check if user is already verified
  if (user.verified) {
    throw new ApiError(400, 'User already verified');
  }

  // Generate OTP and expiry date
  user.otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  await user.save({ validateBeforeSave: false });

  try {
    const title = 'Your OTP For Verification';
    await sendOtpOnEmail(
      title,
      user.email,
      VerifyEmail({ name: user.name, otp: user.otp })
    );
  } catch (error: any) {
    throw new ApiError(
      500,
      error.message || 'Failed to send verification email'
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Verification email sent successfully'));
});

const emailVerification = asyncHandler(async (req, res) => {
  // Validate request body
  const validatedData = emailVerificationValidation.safeParse(req.body);

  if (!validatedData.success) {
    const errorMessages = ZodErrorFormater(validatedData);
    throw new ApiError(400, errorMessages || 'Invalid data');
  }

  const { email, verificationCode } = validatedData.data;

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  // Check if OTP is valid and not expired
  if (user.otp !== verificationCode) {
    throw new ApiError(400, 'Invalid OTP');
  }

  if (!user.otpExpires || user.otpExpires < new Date()) {
    throw new ApiError(400, 'OTP has expired');
  }

  // Verify user and clear OTP
  user.verified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id as string
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Respond with user data and token
  res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(200, 'User logged & varified in successfully', {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken,
        refreshToken,
      })
    );
});

const signOut = asyncHandler(async (req: AuthenticatedRequest, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  res
    .status(200)
    .clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
    })
    .clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, 'User signed out successfully'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw new ApiError(401, 'No refresh token found');
  }

  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;
  } catch (error) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw new ApiError(400, 'User not found');
  }

  const accessToken = user.generateAccessToken();

  res
    .status(200)
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    })
    .json(
      new ApiResponse(200, 'Access token refreshed successfully', accessToken)
    );
});

const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res) => {
  res.status(200).json(
    new ApiResponse(200, 'User found.', {
      user: req.user,
    })
  );
});

const sendOtpToChangePassword = asyncHandler(async (req, res) => {
  const validatedData = emailValidation.safeParse(req.body);

  if (!validatedData.success) {
    const errorMessages = ZodErrorFormater(validatedData);
    throw new ApiError(400, errorMessages || 'Invalid data');
  }

  const { email } = validatedData.data;

  // Rate limit check
  const { canSend, retryAfter } = canResendOtp(email);

  if (!canSend) {
    throw new ApiError(
      429,
      `Too many requests. Please try again after ${retryAfter} minutes.`
    );
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'Email not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  const otpExpires = new Date(Date.now() + 1 * 60 * 1000); // OTP expires in 1 minute

  try {
    const title = 'Your OTP For Password Reset';
    await sendOtpOnEmail(title, email, ForgetPasswordEmail({ otp }));
  } catch (error: any) {
    throw new ApiError(
      500,
      error.message || 'Failed to send verification email'
    );
  }

  res.status(200).json(
    new ApiResponse(200, 'OTP sent successfully', {
      otp,
      otpExpires,
    })
  );
});

const changePassword = asyncHandler(async (req, res) => {
  const validatedData = changePasswordValidation.safeParse(req.body);

  if (!validatedData.success) {
    const errorMessages = ZodErrorFormater(validatedData);
    throw new ApiError(400, errorMessages || 'Invalid data');
  }

  const { email, newPassword } = validatedData.data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, 'Password changed successfully'));
});

export {
  signUp,
  signIn,
  signOut,
  emailVerification,
  reSendVerificationEmail,
  refreshAccessToken,
  getCurrentUser,
  sendOtpToChangePassword,
  changePassword,
};
