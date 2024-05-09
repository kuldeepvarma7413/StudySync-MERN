import React, { useState, useEffect } from 'react'

import './css/Login.css'
import Logo from '../images/StudySyncLogo.png'
import Character from '../images/Character-sitting-chair.png'
import Cactus from '../images/cactus.png'
import { FcGoogle } from "react-icons/fc";
import { SERVER_URL } from '../App'
import { useNavigate } from 'react-router-dom'

function Login() {

    // input values for email and password
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    async function loginUser(e) {
        e.preventDefault()
        try {
            const response = await fetch(`${SERVER_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            const data = await response.json()
            if(data.token){
                localStorage.setItem('token', data.token)
                alert('User logged in successfully')
                navigate('/dashboard')
            }else{
                alert('User not found')
            }
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <div className='login-container'>
        <div className='login-container-main'>
            <div className="left-side">
                <div className='form-container'>
                    <img src={Logo} alt="" className='logo-login'/>

                    <form onSubmit={loginUser}>
                        <label htmlFor="email">Email</label>
                        <input type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='example@gmail.com' />

                        <label htmlFor="password" className='password-label'>Password<span>Forgot Password?</span></label>
                        <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='********'/>

                        <button className='btn login-btn'>
                            Login
                            {/* icon */}
                        </button>
                    </form>

                    <p>or continue with</p>

                    <button className='btn google-btn'>
                        <FcGoogle size={22}/>
                    </button>

                    <p className='login-line'>Don't have an account yet? <a href='/signup'>Sign up for free</a></p>
                </div>
            </div>
            <div className="right-side">
                <img src={Cactus} alt="" className='cactus'/>
                <img src={Character} alt="" className='character'/>
            </div>
        </div>
    </div>
  )
}

export default Login