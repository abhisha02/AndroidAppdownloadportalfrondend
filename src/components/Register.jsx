import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
    is_manager: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { email, first_name, last_name, password, password2, is_manager } = formData;

  const validateForm = () => {
    const newErrors = {};
    
    if (password !== password2) {
      newErrors.password2 = "Passwords do not match";
    }
    
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    
    if (!email.includes('@')) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors");
      return;
    }

    try {
      const submitData = {
        email: email.trim().toLowerCase(),
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        password: password,
        password2: password2,
        is_manager: is_manager
      };

      const { data } = await api.post('/api/register/', submitData);
      
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response) {
        const serverErrors = err.response.data;
        
        if (typeof serverErrors === 'string') {
          toast.error(serverErrors);
          setErrors({ detail: serverErrors });
        } else if (typeof serverErrors === 'object') {
          setErrors(serverErrors);
          Object.entries(serverErrors).forEach(([key, value]) => {
            const errorMessage = Array.isArray(value) ? value[0] : value;
            toast.error(`${key}: ${errorMessage}`);
          });
        }
      } else if (err.request) {
        toast.error("Unable to connect to the server. Please try again.");
        setErrors({ detail: "Network error: Unable to connect to the server" });
      } else {
        toast.error("An unexpected error occurred");
        setErrors({ detail: "An unexpected error occurred" });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-200">
          Sign Up
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium leading-6 text-gray-300"
            >
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={first_name}
              onChange={handleChange}
              autoComplete="given-name"
              required
              className={`block w-full rounded-lg border ${
                errors.first_name ? 'border-red-500' : 'border-gray-700'
              } bg-gray-800 py-2 px-3 text-gray-200 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6`}
            />
            {errors.first_name && (
              <p className="mt-1 text-red-500 text-sm">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium leading-6 text-gray-300"
            >
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={last_name}
              onChange={handleChange}
              autoComplete="family-name"
              required
              className={`block w-full rounded-lg border ${
                errors.last_name ? 'border-red-500' : 'border-gray-700'
              } bg-gray-800 py-2 px-3 text-gray-200 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6`}
            />
            {errors.last_name && (
              <p className="mt-1 text-red-500 text-sm">{errors.last_name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              autoComplete="email"
              required
              className={`block w-full rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              } bg-gray-800 py-2 px-3 text-gray-200 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6`}
              placeholder="name@company.com"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className={`block w-full rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-700'
              } bg-gray-800 py-2 px-3 text-gray-200 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6`}
            />
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password2"
              className="block text-sm font-medium leading-6 text-gray-300"
            >
              Confirm Password
            </label>
            <input
              id="password2"
              name="password2"
              type="password"
              value={password2}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className={`block w-full rounded-lg border ${
                errors.password2 ? 'border-red-500' : 'border-gray-700'
              } bg-gray-800 py-2 px-3 text-gray-200 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6`}
            />
            {errors.password2 && (
              <p className="mt-1 text-red-500 text-sm">{errors.password2}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-gray-800 px-4 py-3 text-sm font-semibold leading-6 text-gray-200 shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition duration-300 border border-gray-700"
            >
              Create account
            </button>
          </div>

          {errors.detail && (
            <p className="text-red-500 text-sm text-center">{errors.detail}</p>
          )}

          <p className="mt-10 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-gray-300 hover:text-gray-200 transition duration-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;