import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import signUpValidation from "@/schemas/signUp";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Spinner from "./Spinner";
import { useState } from "react";
import { z } from "zod";

type SignUpFormValues = z.infer<typeof signUpValidation>;

export default function SignUpForm() {
    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: SignUpFormValues) => {
        setLoading(true);
        try {
            console.log("✅ Form Submitted:", data);
            // await signup API call here
        } catch (error) {
            console.error("❌ Sign Up Error:", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 5000); // Simulate a delay for loading state
        }
    };

    return (
        <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg space-y-6 border border-border">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-textL">Create Account</h2>
                    <p className="text-secondaryL text-sm mt-1">
                        Start coding with us today!
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <User className="w-4 h-4 mr-1 inline-block" /> Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <Mail className="w-4 h-4 mr-1 inline-block" /> Email
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
                                        <Lock className="w-4 h-4 mr-1 inline-block" /> Password
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit */}
                        <Button type="submit" className="w-full mt-4" disabled={loading}>
                            {loading ?
                                <div className="flex items-center justify-center">
                                    <Spinner />
                                    <span className="ml-2">Authenticating...</span>
                                </div>
                                : "Sign Up"}
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
