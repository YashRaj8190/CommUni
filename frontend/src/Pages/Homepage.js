import { Button } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div>
            <nav className='flex items-center justify-between py-4 px-6 bg-slate-800'>
                <div className='text-white text-2xl font-bold '>
                    CommUni
                </div>
                <div>
                    <Link to='/login' className='mx-auto px-5'><Button colorScheme='blue' variant='solid'>
                        Login
                    </Button></Link>
                    <Link to='/signup' className='mx-auto px-5'><Button colorScheme='green' variant='solid'>
                        Signup
                    </Button></Link>
                </div>
            </nav>
        </div>
    )
}

export default Homepage;
