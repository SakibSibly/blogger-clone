import { createContext, useContext, useState, useEffect } from "react";
import { setApiCallbacks } from "../api/api";

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

    /** Called by the Axios interceptor when a silent token refresh succeeds. */
    const updateTokens = (newTokens) => {
        setTokens(newTokens);
    };

    // Register callbacks with the Axios interceptor once on mount
    useEffect(() => {
        setApiCallbacks({
            onTokenRefreshed: updateTokens,
            onLogout: logout,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, tokens, login, logout, updateTokens, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
