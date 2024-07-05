import React from 'react'
import { useNavigate } from 'react-router-dom'

function Success() {
    const navigator = useNavigate();
    return (
        <div className='text-center'>
            <p className='h1 p-5'>
                Thanks for the payment</p>
            <button className='btn btn-primary ' onClick={() => navigator('/')}>back </button>
        </div>
    )
}

export default Success