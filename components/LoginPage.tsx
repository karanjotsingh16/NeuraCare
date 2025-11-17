import React, { useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../firebase';
import { BrainCircuitIcon } from './icons';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            console.error("Authentication error:", err);
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    setError('Invalid email or password.');
                    break;
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists. Please sign in.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto px-4 text-center animate-fade-in">
             <div className="inline-flex items-center justify-center bg-gray-800 text-blue-400 rounded-full p-4 mb-6">
                <BrainCircuitIcon className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100">
                NeuraCare
            </h1>
            <p className="mt-4 text-lg text-gray-300">
                {isSignUp ? 'Create an account to get started.' : 'Sign in to your account.'}
            </p>

            {error && (
                <div className="mt-6 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg text-sm">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="you@example.com"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        disabled={loading}
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </div>
            </form>
            
            <div className="mt-6 text-center">
                <button
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;