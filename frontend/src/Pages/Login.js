import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { InputGroup, InputRightElement, Button, useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Login = () => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [load, setLoad] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShow(!show);
    };

    // Login form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);
        if (!formData.email || !formData.password) {
            toast({
                title: 'All fields are required !!',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "center",
            });
            setLoad(false);
            return;
        }
        try {
            const res = await axios.post("http://localhost:5000/api/user/login", { ...formData });
            toast({
                title: 'Login Successful!!',
                status: 'success',
                duration: 4000,
                isClosable: true,
                position: "center",
            });
            localStorage.setItem("user", JSON.stringify(res.data));
            setLoad(false);
            history.push('/');
        } catch (error) {
            toast({
                title: 'Error occured!!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "center",
            });
            setLoad(false);
        }
    };
    const bgImg = "";
    return (
        <div className="w-full" style={{
            backgroundImage: `url(${bgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh'
        }}>
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
                                <InputGroup>
                                    <input
                                        type={show ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-2 rounded border border-gray-300"
                                        placeholder="********"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button size="sm" mt="1.1rem" onClick={togglePasswordVisibility}>
                                            <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                                isLoading={load}
                            >
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
