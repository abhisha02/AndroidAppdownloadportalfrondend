import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setUserAuthentication } from '../features/authenticationSlice';

const Login = () => {
    const baseURL = "http://127.0.0.1:8000/";
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

    const { email, password } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(baseURL+'/api/login/', formData);
            const { access, refresh, user_id, email, first_name, last_name, is_manager } = response.data;
    
            localStorage.setItem('tokens', JSON.stringify(response.data));
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
    
            const userDetails = {
                user_id,
                email,
                first_name,
                last_name,
                isAuthenticated: true,
                is_manager,
            };
    
            dispatch(setUserAuthentication(userDetails));
    
            toast.success('Login successful! Redirecting...');
    
            if (is_manager) {
                navigate('/manager/home');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid email or password');
            toast.error('Invalid login credentials');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-200">
                    Sign in
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-300">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input 
                                id="email" 
                                name="email" 
                                type="email" 
                                value={email}
                                onChange={handleChange}
                                autoComplete="email" 
                                required 
                                className="block w-full rounded-lg border border-gray-700 bg-gray-800 py-2 px-3 text-gray-200 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-300">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                value={password}
                                onChange={handleChange}
                                autoComplete="current-password" 
                                required 
                                className="block w-full rounded-lg border border-gray-700 bg-gray-800 py-2 px-3 text-gray-200 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div>
                        <button 
                            type="submit" 
                            className="flex w-full justify-center rounded-lg bg-gray-800 px-4 py-3 text-sm font-semibold leading-6 text-gray-200 shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition duration-300 border border-gray-700"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold leading-6 text-gray-300 hover:text-gray-200 transition duration-300">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;