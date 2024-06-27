import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { InputGroup, InputRightElement, Button, useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [pic, setPic] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [load, setLoad] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const postDetails = (pics) => {
        setLoad(true);
        if (pics === undefined) {
            toast({
                title: 'Image not selected.',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "CommUni");
            data.append("cloud_name", "yashr2k26");
            fetch("https://api.cloudinary.com/v1_1/yashr2k26/image/upload", {
                method: 'post',
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setLoad(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoad(false);
                });
        }
        else {
            toast({
                title: 'Please select an image !!',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "bottom",
            });
            setLoad(false);
            return;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast({
                title: 'All fields are required !!',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "bottom",
            });
            setLoad(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: 'Passwords don\'t match !!',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            const res = await axios.post("http://localhost:5000/api/user/", { ...formData, pic });
            toast({
                title: 'Registration successful!!',
                status: 'success',
                duration: 4000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("user", JSON.stringify(res.data));
            setLoad(false);
            history.push('/chats');

        } catch (error) {
            toast({
                title: 'Error occured!!',
                description: error.response.data.message,
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: "bottom",
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
                                        <Button size="sm" mt="1.1rem" onClick={toggleConfirmPasswordVisibility}>
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="pic" className="text-sm font-medium text-black ">
                                    Upload your picture
                                </label>
                                <input
                                    type="file"
                                    name="file"
                                    accept="image/*"
                                    onChange={(e) => postDetails(e.target.files[0])}
                                    className="w-full p-2 mt-2 rounded border border-gray-300"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
                                isLoading={load}
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
