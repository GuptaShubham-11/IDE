import apiClient from "./apiClient";


const signUp = async (userData: any) => {
    try {
        const response = await apiClient.post('/users/sign-up', userData);
        console.log(response);

        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const signIn = async (userData: any) => {
    try {
        const response = await apiClient.post('/users/sign-in', userData);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const signOut = async () => {
    try {
        const response = await apiClient.post('/users/sign-out');
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const verifyEmail = async (userData: any) => {
    try {
        const response = await apiClient.post('/users/verify-email', userData);
        console.log(response.data);

        return response.data;
    } catch (error: any) {
        console.log(error.response.data);

        throw error.response.data;
    }
}

const resendVerificationEmail = async (userData: any) => {
    try {
        const response = await apiClient.post('/users/resend-verification-email', userData);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/users/current-user');
        console.log(response.data);

        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const getOtpToChangePassword = async (userData: any) => {
    try {
        const response = await apiClient.post('/users/send-otp-to-change-password', userData);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const changePassword = async (userData: any) => {
    try {
        const response = await apiClient.post('/users/change-password', userData);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const userApi = {
    signUp,
    signIn,
    signOut,
    verifyEmail,
    resendVerificationEmail,
    getCurrentUser,
    getOtpToChangePassword,
    changePassword
}