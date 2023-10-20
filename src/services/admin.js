import { toast } from 'react-toastify';
import { getCookie } from "../utils/cookie-manager";





export const getAllUsers = async() => {
    try {
        const apiRequest = await fetch("http://localhost:8000/v1/api/admin/alluser", {
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


export const deleteUserAdmin = async(userId) => {
    try{
        const apiRequest = await fetch(`http://localhost:8000/v1/api/admin/deleteUserAdmin/${userId}`,{
            method:"GET",
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
    }catch(error){
        console.log(error);
        throw error;
    };
};


export const toggleBlockUser = async(userId) => {
    try {
        const apiRequest = await fetch(`http://localhost:8000/v1/api/admin/blokUser/${userId}`, {
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
    } catch(error) {
        console.error(error);
        throw error;
    };
};

