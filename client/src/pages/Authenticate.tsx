import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignUp, SignIn } from '@/components';
import { UserPlus, LogIn, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Authenticate({ flag = false }: { flag: boolean }) {
    const [isReturningUser, setIsReturningUser] = useState(flag);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-bgL flex flex-col items-center justify-center px-4 py-12">
            <Button variant='ghost' className="absolute top-4 left-4 rounded hover:bg-secondaryL/10" onClick={() => navigate('/')}>
                <ArrowLeft />
            </Button >
            <div className="relative w-full max-w-md mt-2 space-y-8">
                {/* Glow Background */}
                <motion.div
                    className="absolute -inset-6 rounded-3xl blur-2xl opacity-20 z-0"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-primaryL), var(--color-accentL))',
                    }}
                    animate={{ opacity: [0.15, 0.25, 0.15] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                />

                {/* Toggle Switch */}
                <div className="relative z-10 bg-secondaryL/10 rounded p-1 flex items-center justify-between backdrop-blur-sm shadow-md">
                    <motion.div
                        className="absolute h-[calc(100%-6px)] w-1/2 bg-bgL rounded shadow transition-all"
                        initial={false}
                        animate={{ left: isReturningUser ? '50%' : '3px' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    />
                    <button
                        onClick={() => {
                            setIsReturningUser(false);
                            navigate('/authenticate/signup');
                        }}
                        className={`z-10 cursor-pointer w-1/2 py-2 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 ${!isReturningUser ? 'text-textL' : 'text-secondaryL'}`}
                    >
                        <UserPlus className="w-4 h-4" />
                        Create
                    </button>
                    <button
                        onClick={() => {
                            setIsReturningUser(true);
                            navigate('/authenticate/signin');
                        }}
                        className={`z-10 cursor-pointer w-1/2 py-2 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 ${isReturningUser ? 'text-textL' : 'text-secondaryL'}`}
                    >
                        <LogIn className="w-4 h-4" />
                        Login
                    </button>
                </div>

                {/* Form Container */}
                <div className="z-10 relative">
                    <AnimatePresence mode="wait">
                        {isReturningUser ? (
                            <motion.div
                                key="signin"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <SignIn />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <SignUp />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
