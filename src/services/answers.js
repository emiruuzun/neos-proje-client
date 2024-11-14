import { toast } from 'react-toastify';
import { getCookie } from '../utils/cookie-manager';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const addAnswers = async (answersData) => {
    const { content, question_id } = answersData;
    try {
        const apiRequest = await fetch(`${BASE_URL}/questions/answers/${question_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie('access_token')}`,
            },
            body: JSON.stringify({ content }),
            credentials: 'include'
        });

        const data = await apiRequest.json();
        console.log(data);
        if (data.success) {
            toast.success('Yorum başarıyla eklendi', { autoClose: 2000 });
            return data.data;  // Return the added answer
        } else {
            toast.error(data.message);
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("API request failed:", error);
        toast.error(error.message || "API request failed");
        throw error;
    }
};

export const getMyAnswer = async () => {
    try {
        const apiRequest = await fetch(`${BASE_URL}/questions/answers/getMyAnswer`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getCookie('access_token')}`,
            },
            credentials: 'include'
        });

        const data = await apiRequest.json();
        console.log(data);
        return data;
        
    } catch (error) {
        console.error("API request failed:", error);
        toast.error(error.message || "API request failed");
        throw error;
    }
};
