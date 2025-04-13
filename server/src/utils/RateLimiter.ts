type OtpRateLimitResult = {
    canSend: boolean;
    retryAfter?: number; // retry time in minutes if rate-limited
};

const otpRateLimitMap = new Map<string, { count: number; lastRequest: number }>();

const MAX_REQUESTS = 3;
const TIME_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const canResendOtp = (email: string): OtpRateLimitResult => {
    const now = Date.now();
    const record = otpRateLimitMap.get(email);

    if (!record) {
        otpRateLimitMap.set(email, { count: 1, lastRequest: now });
        return { canSend: true };
    }

    const { count, lastRequest } = record;

    if (now - lastRequest > TIME_WINDOW_MS) {
        otpRateLimitMap.set(email, { count: 1, lastRequest: now });
        return { canSend: true };
    }

    if (count < MAX_REQUESTS) {
        otpRateLimitMap.set(email, { count: count + 1, lastRequest });
        return { canSend: true };
    }

    // If rate-limited, calculate retry time in minutes
    const retryAfter = Math.ceil((TIME_WINDOW_MS - (now - lastRequest)) / (1000 * 60)); // in minutes
    return { canSend: false, retryAfter };
};
