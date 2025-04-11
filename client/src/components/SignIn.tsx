import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import signInValidation from "@/schemas/signIn";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Spinner from "./Spinner";
import { z } from "zod";
import { GlassAlertProps } from "./Alert";
import { userApi } from "@/api/userApi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { eligibleToVerify, signIn } from "@/features/authSlice";


type LoginFormValues = z.infer<typeof signInValidation>;

export default function SignInForm({ setAlert }: { setAlert: (alert: GlassAlertProps) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(signInValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const response = await userApi.signIn(data);
            console.log(response);

            if (response.statusCode === 200) {
                setAlert({
                    type: "success",
                    title: "Authentication Successful",
                    message: response.message,
                });
                response.data.user.verified ? (
                    dispatch(signIn({ user: response.data.user })),
                    navigate("/dashboard")
                ) : (
                    dispatch(eligibleToVerify()),
                    navigate(`/authenticate/verify-email/${response.data.user.email}`)
                );
            } else {
                setAlert({
                    type: "error",
                    title: "Authentication Failed",
                    message: response.message,
                });
            }
        } catch (error: any) {
            setAlert({
                type: "error",
                title: "Authentication Failed",
                message: error.message || "Something went wrong during sign-in. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg space-y-6 border border-border">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-textL">Welcome Back</h2>
                    <p className="text-secondaryL text-sm mt-1">
                        Happy to see you again!
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <Mail className="w-4 h-4" /> Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <Lock className="w-4 h-4" /> Password
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondaryL"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit */}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ?
                                <div className="flex items-center justify-center">
                                    <Spinner />
                                    <span className="ml-2">Logging in...</span>
                                </div>
                                :
                                "Log In"
                            }
                        </Button>
                    </form>
                </Form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-secondaryL" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase text-secondaryL">
                        <span className="bg-card px-2">or continue with</span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <Button variant="outline" className="w-full">Google</Button>
                </div>
            </div>
        </div>
    );
}
