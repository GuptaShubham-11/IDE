import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Alert, Spinner } from '@/components';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassAlertProps } from '@/components/Alert';
import { userApi } from '@/api/userApi';
import { useAppDispatch } from '../hooks/redux';
import { signIn } from '@/features/authSlice';

const VerifyEmail = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<GlassAlertProps | null>(null);
  const dispatch = useAppDispatch();

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
        const response = await userApi.verifyEmail({
          email,
          verificationCode: otp,
        });

        if (response.statusCode === 200) {
          setAlert({
            type: 'success',
            title: 'Email Verified',
            message: response.message,
          });
          dispatch(signIn({ user: response.data.user }));
          navigate('/dashboard');
        } else {
          setAlert({
            type: 'error',
            title: 'Email Verification Failed',
            message: response.message,
          });
        }
      } catch (error: any) {
        setAlert({
          type: 'error',
          title: 'OTP Verification Failed',
          message:
            error.message || 'An error occurred while verifying your email.',
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
      if (response.statusCode === 200) {
        setAlert({
          type: 'success',
          title: 'Resend OTP',
          message: response.message,
        });
      } else {
        setAlert({
          type: 'error',
          title: 'Resend OTP Failed',
          message: response.message,
        });
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        title: 'Resend OTP Failed',
        message: error.message || 'An error occurred while resending the OTP.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgL px-4 relative">
      {/* Alert */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50"
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

      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-5 left-5 hover:bg-secondaryL/10"
        onClick={() => navigate('/authenticate/signin')}
      >
        <ArrowLeft className="w-5 h-5 text-textL" />
        <span className="sr-only">Back</span>
      </Button>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-border relative overflow-hidden">
        {/* Glow Ring */}
        <div className="absolute -inset-1 bg-gradient-to-br from-primaryL to-[#D2AFFD] rounded-2xl blur-2xl opacity-10 z-[-1]" />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-textL">Verify your email</h1>
          <p className="text-sm text-secondaryL">
            Enter the 6-digit code sent to{' '}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* OTP Inputs */}
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

        {/* Verify Button */}
        <Button
          className="w-full mt-6"
          onClick={handleVerify}
          disabled={otp.length < 6 || loading}
        >
          {loading ? <Spinner /> : 'Verify Email'}
        </Button>

        {/* Resend Link */}
        <div className="text-sm text-textL/60 text-center mt-4">
          Didn’t receive the code?{' '}
          {resendTimer === 0 ? (
            <button
              onClick={handleResend}
              className="text-primaryL font-medium hover:underline"
            >
              Resend
            </button>
          ) : (
            <span className="text-textL/40">Resend in {resendTimer}s</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
