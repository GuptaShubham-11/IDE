import { Html, Head, Body, Container, Text, Heading, Section } from '@react-email/components';

type ForgetPasswordEmailProps = {
    name?: string;
    otp: string;
};

export default function ForgetPasswordEmail({ name = 'there', otp }: ForgetPasswordEmailProps) {
    return (
        <Html>
            <Head />
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Heading style={styles.logo}>🔒 Coditor</Heading>

                    <Heading as="h2" style={styles.heading}>
                        Forgot Password Request
                    </Heading>

                    <Text style={styles.message}>
                        Hi {name},<br />
                        Use the following OTP to reset your password. It’s valid for the next <strong>10 minutes</strong>.
                    </Text>

                    <Section style={styles.otpBox}>
                        <Text style={styles.otp}>{otp}</Text>
                    </Section>

                    <Text style={styles.note}>
                        If you didn’t request a password reset, you can safely ignore this email.
                    </Text>

                    <Text style={styles.footer}>
                        &copy; 2025 Coditor. All rights reserved.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const styles = {
    body: {
        backgroundColor: '#f4f4f7',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    container: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '500px',
        margin: '20px auto',
        textAlign: 'center' as const,
    },
    logo: {
        fontSize: '24px',
        color: '#3b82f6',
        fontWeight: 'bold' as const,
        marginBottom: '20px',
    },
    heading: {
        fontSize: '20px',
        color: '#1a1b26',
        marginBottom: '10px',
    },
    message: {
        fontSize: '16px',
        color: '#555555',
        marginBottom: '30px',
    },
    otpBox: {
        display: 'inline-block',
        padding: '12px 25px',
        backgroundColor: '#f0f4ff',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    otp: {
        fontSize: '24px',
        color: '#3b82f6',
        fontWeight: 'bold' as const,
        letterSpacing: '4px',
    },
    note: {
        fontSize: '14px',
        color: '#777777',
        marginTop: '20px',
    },
    footer: {
        fontSize: '12px',
        color: '#999999',
        marginTop: '30px',
    },
};
