import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Alert, Spinner } from "@/components";
import { AnimatePresence, motion } from "framer-motion";
import { GlassAlertProps } from "@/components/Alert";
import { userApi } from "@/api/userApi";
import { Input } from "@/components/ui/input";
import { z } from "zod";

// Password validation schema
const passwordValidation = z.string()
    .min(8, "Minimum 8 characters")
    .max(12, "Maximum 12 characters")
    .regex(/(?=.*[a-z])/, "At least one lowercase")
    .regex(/(?=.*[A-Z])/, "At least one uppercase")
    .regex(/(?=.*\d)/, "At least one number")
    .regex(/(?=.*[@$!%*?&])/, "At least one special character")
    .regex(/^\S*$/, "No spaces allowed")
    .trim();

const ChangePassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [actualOtp, setActualOtp] = useState("");
    const [expiresIn, setExpiresIn] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<GlassAlertProps | null>(null);
    const [step, setStep] = useState<"email" | "otp" | "password">("email");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Universal alert setter
    const showAlert = (type: GlassAlertProps["type"], title: string, message: string) => {
        setAlert({ type, title, message });
    };

    // Countdown timer for OTP expiry
    useEffect(() => {
        if (step === "otp" && expiresIn) {
            const expiry = new Date(expiresIn).getTime();
            const interval = setInterval(() => {
                const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
                setTimeLeft(remaining);
                if (remaining <= 0) clearInterval(interval);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [expiresIn, step]);

    const handleGetOtp = async () => {
        if (!email) {
            showAlert("error", "Email Required", "Please enter your email.");
            return;
        }
        setLoading(true);
        try {
            const res = await userApi.getOtpToChangePassword({ email });

            if (res.statusCode === 200) {
                showAlert("success", "OTP Sent!", `Check your inbox at ${email}.`);
                setActualOtp(res.data.otp);
                setExpiresIn(res.data.otpExpires);
                setStep("otp");
            } else {
                showAlert("error", "Failed", res.message);
            }
        } catch (error: any) {
            showAlert("error", "Error", error.message || "Unable to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = () => {
        if (otp.length !== 6) {
            showAlert("error", "Invalid OTP", "Please enter a 6-digit OTP.");
            return;
        }
        if (otp !== actualOtp || new Date() > new Date(expiresIn)) {
            showAlert("error", "Invalid or Expired OTP", "Check your OTP or its validity.");
            return;
        }
        setStep("password");
    };

    const handleChangePassword = async () => {
        const result = passwordValidation.safeParse(newPassword);
        if (!result.success) {
            showAlert("error", "Invalid Password", result.error.issues[0].message);
            return;
        }
        setLoading(true);
        try {
            const res = await userApi.changePassword({ email, newPassword });
            if (res.statusCode === 200) {
                showAlert("success", "Success!", res.message);
                setTimeout(() => navigate("/authenticate/signin"), 1500);
            } else {
                showAlert("error", "Change Failed", res.message);
            }
        } catch (error: any) {
            showAlert("error", "Error", error.message || "Unable to change password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bgL px-4 relative">
            <AnimatePresence>
                {alert && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50"
                    >
                        <Alert {...alert} onClose={() => setAlert(null)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                variant="ghost"
                size="icon"
                className="absolute top-5 left-5 hover:bg-secondaryL/10"
                onClick={() => navigate("/authenticate/signin")}
                disabled={loading}
            >
                <ArrowLeft className="w-5 h-5 text-textL" />
                <span className="sr-only">Back</span>
            </Button>

            <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-border relative overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-br from-primaryL to-[#D2AFFD] rounded-2xl blur-2xl opacity-10 z-[-1]" />

                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold text-textL">
                        {step === "email" ? "Reset Password" : step === "otp" ? "Verify OTP" : "Set a New Password"}
                    </h1>
                    <p className="text-sm text-secondaryL">
                        {step === "email"
                            ? "Enter your email to receive an OTP"
                            : step === "otp"
                                ? `Enter the 6-digit OTP sent to ${email}`
                                : "Enter your new password below"}
                    </p>
                    <p className="text-xs text-red-500 mt-1 font-medium">⚠️ Do not refresh this page until the process is complete.</p>
                </div>


                {/* Email Step */}
                {step === "email" && (
                    <div className="mt-6 space-y-4">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                        <Button className="w-full" onClick={handleGetOtp} disabled={!email || loading}>
                            {loading ? <Spinner /> : "Send OTP"}
                        </Button>
                    </div>
                )}

                {/* OTP Step */}
                {step === "otp" && (
                    <>
                        <div className="mt-6 flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={setOtp}
                                autoFocus
                                disabled={loading}
                                className="w-full max-w-xs"
                            >
                                <InputOTPGroup className="flex justify-center gap-2 sm:gap-1">
                                    {[...Array(6)].map((_, i) => (
                                        <InputOTPSlot
                                            key={i}
                                            index={i}
                                            className="w-10 h-12 sm:w-8 sm:h-10 border border-secondaryL rounded text-center text-lg"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <div className="text-sm text-secondaryL text-center mt-3">
                            Expires in:{" "}
                            <span className={`font-medium ${timeLeft > 0 ? "text-green-600" : "text-red-600"}`}>
                                {timeLeft}s
                            </span>
                            {timeLeft === 0 && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-primaryL font-medium ml-2 px-0"
                                    onClick={handleGetOtp}
                                    disabled={loading}
                                >
                                    Resend OTP
                                </Button>
                            )}
                        </div>

                        <Button className="w-full mt-6" onClick={handleVerifyOtp} disabled={otp.length < 6 || loading}>
                            {loading ? <Spinner /> : "Verify OTP"}
                        </Button>
                    </>
                )}

                {/* Password Step */}
                {step === "password" && (
                    <>
                        <div className="mt-6 relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                disabled={loading}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-3 -translate-y-1/2"
                                onClick={() => setShowPassword((prev) => !prev)}
                                disabled={loading}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </Button>
                        </div>
                        <Button
                            className="w-full mt-6"
                            onClick={handleChangePassword}
                            disabled={newPassword.length < 8 || loading}
                        >
                            {loading ? <Spinner /> : "Change Password"}
                        </Button>
                    </>
                )}
            </div>
        </div >
    );
};

export default ChangePassword;
