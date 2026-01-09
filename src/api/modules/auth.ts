import { API_BASE_URL } from "../../../env.ts";
import api from '../api.ts';

export const authLogin = async (requestData) => {
    try {
        const response = await api.post('/login', requestData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const loginWithGoogle = async ({
                                          token,
                                            email
                                      }: {
    token: string;
    email: string;
}) => {
    console.log(`${API_BASE_URL}/auth/google`)
    return api.post(`${API_BASE_URL}/auth/google`, {
        token,
        email,
    });
};



export const fetchGenericData = async (endpoint: string) => {
    const res = await api.get(`/background/${endpoint}`);
    return res.data;
};