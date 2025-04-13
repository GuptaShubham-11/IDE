import {
    Html,
    Body,
    Container,
    Text,
    Heading,
    Tailwind,
    Section,
} from '@react-email/components';

interface VerifyEmailProps {
    name: string;
    otp: string;
}

const VerifyEmail = ({ name, otp }: VerifyEmailProps) => {
    return (
        <Html>
            <Tailwind>
                <Body className="bg-[#f4f6f8] text-[#1a1b26] font-sans">
                    <Container className="max-w-md mx-auto py-10 px-6 bg-white border border-gray-200 rounded-2xl shadow-md">
                        <Heading className="text-xl font-semibold mb-4 text-[#3B82F6]">
                            Email Verification
                        </Heading>

                        <Text className="text-base mb-2">Hi <strong>{name}</strong>,</Text>

                        <Text className="text-base mb-4">
                            To complete your action, please use the following One-Time Password (OTP):
                        </Text>

                        <Section className="text-center my-6">
                            <Text className="inline-block text-3xl tracking-widest font-mono font-bold text-[#1a1b26] bg-gray-100 px-6 py-3 rounded-md shadow-inner">
                                {otp}
                            </Text>
                        </Section>

                        <Text className="text-sm text-gray-600 mb-6">
                            This OTP will expire in 10 minutes. Please do not share it with anyone.
                        </Text>

                        <Text className="text-xs text-gray-400 text-center border-t pt-6">
                            &copy; {new Date().getFullYear()} Coditor. All rights reserved.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default VerifyEmail;
