import { Button } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div>
            <nav className='text-right py-5'>
                <Link to='/login' className='mx-auto px-5'><Button colorScheme='teal' variant='solid'>
                    Login
                </Button></Link>
                <Link to='/signup' className='mx-auto px-5'><Button colorScheme='teal' variant='solid'>
                    Signup
                </Button></Link>
            </nav>
        </div>
    )
}

export default Homepage;
