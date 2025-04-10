import { useEffect } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassAlertProps {
    type?: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
    onClose?: () => void;
    duration?: number; // auto-close duration in ms
}

const iconMap = {
    success: Check,
    error: X,
    info: Info,
    warning: AlertCircle,
};

const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-sky-500",
    warning: "text-yellow-500",
};

const Alert: React.FC<GlassAlertProps> = ({
    type = "info",
    title,
    message,
    onClose,
    duration = 3000,
}) => {
    const Icon = iconMap[type];
    const color = iconColors[type];

    // Auto close effect
    useEffect(() => {
        if (onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [onClose, duration]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            className="relative w-full max-w-xl mx-auto p-4 rounded-2xl bg-textL/5 border border-textL/10 backdrop-blur-md shadow-xl overflow-hidden"
        >
            {/* Glow ring */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primaryL to-[#D2AFFD] opacity-20 blur-sm z-[-1]" />

            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn("pt-1", color)}>
                    <Icon className="w-6 h-6" />
                </div>

                {/* Text */}
                <div className="flex-1">
                    <h3 className="text-textL font-medium text-base">{title}</h3>
                    <p className="text-textL/80 text-sm">{message}</p>
                </div>

                {/* Close button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-textL/50 hover:text-textL transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default Alert;
