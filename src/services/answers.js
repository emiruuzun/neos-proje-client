import { toast } from 'react-toastify';
import { getCookie} from '../utils/cookie-manager'



export const addAnswers = async(answersData) => {
    const {content, question_id} = answersData;
    try {
        const apiRequest = await fetch(`http://localhost:8000/v1/api/questions/${question_id}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${getCookie('access_token')}`,
            },
            body: JSON.stringify({content:content}),
            credentials: 'include'
        });

        const data = await apiRequest.json();
        console.log(data)
        if (data.success) {
            toast.success('Yorum başarıyla eklendi', { autoClose: 2000 });
            return data.data;  // Return the added answer
        } else {
            toast.error(data.message);
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("API request failed:", error);
        toast.error(error);
        throw error;
    }
};
