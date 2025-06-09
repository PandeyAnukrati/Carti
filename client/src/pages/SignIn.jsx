import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'; 
import { useNavigate } from 'react-router-dom';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // For success or error messages
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        setMessage(''); // Clear previous messages
        setMessageType('');

        if (!email || !password) {
            setMessage('Please enter both email and password.');
            setMessageType('error');
            return;
        }

        // Firebase sign-in
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setMessage('Sign-in successful! Welcome back.');
                setMessageType('success');
                // Redirect after a short delay so user can see message
                setTimeout(() => {
                    navigate('/products'); 
                }, 1000);
            })
            .catch((error) => {
                setMessage(error.message);
                setMessageType('error');
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f4ee] p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign In</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="********"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-md text-sm ${
                            messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="text-center">
                        <a href="#" className="font-medium text-grey-600 hover:text-grey-500 text-sm">
                            Forgot your password?
                        </a>
                        <p className="mt-2 text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <a href="/signup" className="font-medium text-grey-600 hover:text-grey-500">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignInPage;
