import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import Main3d from "./Main3d";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();
    return (
        <section className="w-full bg-bgL py-24 md:py-28 lg:py-12">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">

                <div className="max-w-2xl text-center lg:text-left space-y-6">
                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold leading-tight text-[#1A1B26]"
                    >
                        Code Together.
                        <br className="hidden sm:inline-block" />
                        <span className="text-primaryL">In Real-Time.</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-lg text-[#4B5563]"
                    >
                        Live code editor with team talks, templates, and video calling—built for devs.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                    >
                        <Button
                            size="lg"
                            className="text-white rounded bg-primaryL hover:bg-primaryL/90"
                            onClick={() => navigate("/authenticate/signup")}
                        >
                            GET STARTED
                        </Button>
                        <Button variant="outline" size="lg" className="flex items-center rounded gap-2">
                            <PlayCircle className="w-5 h-5" /> Live Demo
                        </Button>
                    </motion.div>

                    {/* Demo Note */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="text-sm text-[#10B981] font-medium pt-2"
                    >
                        🚀 Try it now — no sign-up needed.
                    </motion.div>
                </div>

                {/* Right: 3D Cube Visual */}
                <div className="mt-10 w-full lg:w-[850px] h-[350px] sm:h-[450px] md:h-[550px]">
                    <Main3d />
                </div>
            </div>
        </section>
    );
}
