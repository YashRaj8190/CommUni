import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const handleClick = () => {
        setShow(!show)
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Login form submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement your login logic here
    };
    return (
        <div className="w-full style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}">
            <div className="flex flex-col mx-auto mt-20 bg-gray-300 rounded-md" style={{ width: '400px' }}>
                <div className="flex flex-col w-full p-4 text-left">
                    <div className="mx-2">
                        {/* Login form */}
                        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="text-sm font-medium text-black ">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 mt-2 rounded border border-gray-300 "
                                    placeholder="Enter your email address"
                                />
                            </div>
                            <div className="mb-4 items-center">
                                <label htmlFor="password" className="text-sm font-medium text-black ">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full p-2 mt-2 rounded border border-gray-300 "
                                    placeholder="********"
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
                                Login
                            </button>
                        </form>
                        <Link to='/signup'><button className="text-blue-700 rounded-md py-2 my-2 px-2 w-full" ><strong>New User??</strong></button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
