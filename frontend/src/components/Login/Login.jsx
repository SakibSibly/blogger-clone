import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/v1/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Google login failed');
            }

            const tokens = await res.json();

            // Fetch logged-in user profile
            const meRes = await fetch(`${API_URL}/api/v1/auth/users/me`, {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });

            if (!meRes.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const userData = await meRes.json();

            // Save user + tokens in context (and localStorage)
            login(userData, tokens);
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google sign-in was cancelled or failed. Please try again.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col items-center gap-6">
                <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                <p className="text-gray-500 text-sm text-center">
                    Sign in to your account to continue
                </p>

                {error && (
                    <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 text-center">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-gray-500 text-sm">Signing you in...</div>
                ) : (
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        theme="outline"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                    />
                )}
            </div>
        </div>
    );
};

export default Login;
