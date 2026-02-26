import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError(null);
        try {
            const { data: tokens } = await api.post('/api/v1/auth/google', {
                credential: credentialResponse.credential,
            });

            // Fetch logged-in user profile (access token is auto-attached by interceptor
            // after login stores it, but we set it manually here since we just got it)
            const { data: userData } = await api.get('/api/v1/auth/users/me', {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });

            // Save user + tokens in context (and localStorage)
            login(userData, tokens);
            navigate('/home');
        } catch (err) {
            const message =
                err.response?.data?.detail || err.message || 'Google login failed';
            setError(message);
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
