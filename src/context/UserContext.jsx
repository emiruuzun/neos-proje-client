import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Local storage'dan kullanıcı bilgisi yükleyerek başlat
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Kullanıcı state'i değiştiğinde local storage'ı güncelle
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // setUser fonksiyonunu override ederek her değişiklikte local storage'ı da güncelle
    const handleSetUser = (newUser) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('user');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser: handleSetUser }}>
            {children}
        </UserContext.Provider>
    );
};
