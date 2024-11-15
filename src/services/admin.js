import { toast } from 'react-toastify';
import { getCookie } from "../utils/cookie-manager";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllUsers = async () => {
    try {
        const apiRequest = await fetch(`${BASE_URL}/admin/alluser`, {
            method: "GET",
            headers: {
                Authorization: `Bearer: ${getCookie('access_token')}`,
            },
        });

        if (!apiRequest.ok) {
            const textResponse = await apiRequest.text();
            console.error("API error response:", textResponse);
            throw new Error(`API request failed with status ${apiRequest.status}`);
        }

        const response = await apiRequest.json();
        return response;

    } catch (error) {
        console.error("Kullanıcıları çekerken hata oluştu.", error);
        throw error;
    }
};

export const deleteUserAdmin = async (userId) => {
    try {
        const apiRequest = await fetch(`${BASE_URL}/admin/deleteUserAdmin/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer: ${getCookie('access_token')}`,
            },
        });

        const response = await apiRequest.json();

        if (!apiRequest.ok) {
            toast.error(`Hata: ${response.message}`);
        }

        toast.success("Kullanıcı başarıyla silindi!");
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const toggleBlockUser = async (userId) => {
    try {
        const apiRequest = await fetch(`${BASE_URL}/admin/blokUser/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer: ${getCookie('access_token')}`,
            },
        });

        const response = await apiRequest.json();
        console.log(response.Blok)

        if (!apiRequest.ok) {
            toast.error(`Hata: ${response.message}`);
        } else {
            if (response.Blok) {
                toast.success("Kullanıcı başarıyla Bloklandı!");
            } else {
                toast.success("Kullanıcının Bloku başarıyla kaldırıldı!");
            }
        }

        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const announcement = async (announcementModel) => {
    const { title, content } = announcementModel;
    try {
        const apiRequest = await fetch(`${BASE_URL}/admin/announcement`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer: ${getCookie('access_token')}`,
            },
            body: JSON.stringify({
                title, content
            }),
            credentials: "include",
            //
        });

        const response = await apiRequest.json();

        if (apiRequest.ok) {
            toast.success("Announcement added successfully!");
        } else {
            toast.error(`Error: ${response.message || 'Failed to add announcement.'}`);
        }
        console.log(response)
        return response;

    } catch (error) {
        
        toast.error(`Error: ${error.message || 'Failed to add announcement.'}`);
        throw error;
    }
};
