import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, Spinner } from "@/components";
import { AnimatePresence, motion } from "framer-motion";
import { GlassAlertProps } from "@/components/Alert";
import { userApi } from "@/api/userApi";
import { useDispatch } from "react-redux";
import { signIn } from "@/features/authSlice";

const VerifyEmail = () => {
    const { email } = useParams();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const navigate = useNavigate();
    const [alert, setAlert] = useState<GlassAlertProps | null>(null);
    const dispatch = useDispatch();


    // Countdown timer for resend button
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleVerify = async () => {
        if (otp.length === 6) {
            setLoading(true);
            try {
                const response = await userApi.verifyEmail({ email, verificationCode: otp });

                if (response.statusCode === 200) {
                    setAlert({
                        type: "success",
                        title: "Email Verified",
                        message: response.message,
                    });
                    dispatch(signIn({
                        user: response.data.user,
                        accessToken: response.data?.accessToken,
                        refreshToken: response.data?.refreshToken,
                    }));
                    navigate("/dashboard");
                } else {
                    setAlert({
                        type: "error",
                        title: "Email Verification Failed",
                        message: response.message,
                    });
                }
            } catch (error: any) {
                setAlert({
                    type: "error",
                    title: "OTP Verification Failed",
                    message: error.message || "An error occurred while verifying your email.",
                });
            } finally {
                setLoading(false);
            }

        }
    };

    const handleResend = async () => {
        setResendTimer(30);
        try {
            const response = await userApi.resendVerificationEmail({ email });
            console.log(response);

            if (response.statusCode === 200) {
                setAlert({
                    type: "success",
                    title: "Resend OTP",
                    message: response.message,
                });
            } else {
                setAlert({
                    type: "error",
                    title: "Resend OTP Failed",
                    message: response.message,
                });
            }
        } catch (error: any) {
            setAlert({
                type: "error",
                title: "Resend OTP Failed",
                message: error.message || "An error occurred while resending the OTP.",
            });
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-bgL">
            <AnimatePresence>
                {alert && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50"
                    >
                        <Alert
                            type={alert.type}
                            title={alert.title}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <Button variant='ghost' className="absolute top-4 left-4 hover:bg-secondaryL/10" onClick={() => navigate('/authenticate/signin')}>
                <span className="sr-only">Go back</span>
                <ArrowLeft />
            </Button>
            <div className="w-full max-w-md bg-white backdrop-blur-lg border border-border rounded-2xl p-8 shadow-xl space-y-6 relative">
                {/* Glow effect ring */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primaryL to-[#D2AFFD] blur-xl opacity-10 z-[-1]" />

                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold text-textL">Verify your email</h1>
                    <p className="text-sm text-secondaryL">
                        We’ve sent a 6-digit code to <span className="font-medium">{email}</span>
                    </p>
                </div>

                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    autoFocus
                    disabled={loading}
                >
                    <InputOTPGroup>
                        {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i} className="border-1 rounded ml-6 border-secondaryL" />
                        ))}
                    </InputOTPGroup>
                </InputOTP>

                <Button
                    className="w-full mt-2"
                    onClick={handleVerify}
                    disabled={otp.length < 6 || loading}
                >
                    {loading ? <Spinner /> : "Verify Email"}
                </Button>

                <div className="text-center text-sm text-textL/60 mt-4">
                    Didn’t receive the code?{" "}
                    {resendTimer === 0 ? (
                        <button
                            onClick={handleResend}
                            className="text-primaryL font-medium hover:underline"
                        >
                            Resend
                        </button>
                    ) : (
                        <span className="text-textL/50">Resend in {resendTimer}s</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
