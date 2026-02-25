import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "auth";

export const AuthProvider = ({ children }) => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    const [user, setUser] = useState(stored?.user ?? null);
    const [tokens, setTokens] = useState(stored?.tokens ?? null);

    const login = (userData, tokenData) => {
        setUser(userData);
        setTokens(tokenData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, tokens: tokenData }));
    };

    const logout = () => {
        setUser(null);
        setTokens(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, tokens, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
