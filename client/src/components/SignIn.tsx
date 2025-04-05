'use client';

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
import { Link } from "react-router-dom";

type LoginFormValues = z.infer<typeof signInValidation>;

export default function SignInForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(signInValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        console.log("Logging in with:", data);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 5000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bgL px-4">
            <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg space-y-6 border border-border">
                <h2 className="text-3xl font-semibold text-center text-textL">
                    Welcome back
                </h2>

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

                <p className="text-sm font-mono text-secondaryL text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
