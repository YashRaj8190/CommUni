import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { InputGroup, InputRightElement, Button } from "@chakra-ui/react";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // send form data to server to store it in database
        try {
            const res = await axios.post("http://localhost:5000/user/signup", formData)
            const user = res.data.newUser;
            console.log(user);
            localStorage.setItem("email", JSON.stringify(user.email));
            if (user.isVerified) {
                localStorage.setItem("user", JSON.stringify(user));
            }

        }
        catch (error) {
            if (!error.response) {
                alert("server is not running");
                return;
            }
            if (error.response.data.message) {
                alert(error.response.data.message);
            }
            else {
                alert(error.response.data);
            }

        }
    };
    const bgImg = "https://img.freepik.com/premium-vector/seamless-pattern-with-different-social-media-icons_405287-75.jpg";
    return (
        <div className="w-full style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}">
            <div className="flex flex-col mx-auto mt-20 bg-gray-300 rounded-md" style={{ width: '400px' }}>
                <div className="flex flex-col w-full p-4 text-left">
                    <div className="mx-2">
                        {/* Signup form */}
                        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
                        <form onSubmit={handleSubmit} >
                            <div className="mb-4">
                                <label htmlFor="name" className="text-sm font-medium text-black ">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 mt-2 rounded border border-gray-300 "
                                    placeholder="Enter your name"
                                />
                            </div>
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
                            <div className="mb-4 ">
                                <label htmlFor="password" className="text-sm font-medium text-black ">
                                    Password
                                </label>
                                <InputGroup>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-2 rounded border border-gray-300"
                                        placeholder="********"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button size="sm" mt="1.1rem" onClick={togglePasswordVisibility}>
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </div>
                            <div className="mb-4 ">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-black ">
                                    Confirm Password
                                </label>
                                <InputGroup>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-2 rounded border border-gray-300"
                                        placeholder="********"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button size="sm" bg-white mt="1.1rem" onClick={toggleConfirmPasswordVisibility}>
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
                            >
                                Sign Up
                            </button>
                        </form>
                        <Link to='/login'><button className="text-green-700 rounded-md py-2 my-2 px-2 w-full" ><strong>Already a User??</strong></button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
