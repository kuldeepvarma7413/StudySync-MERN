import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './css/Login.css'
import Logo from '../images/logo.png'
import Character from '../images/Character-sitting-chair.png'
import Cactus from '../images/cactus.png'
import { FcGoogle } from "react-icons/fc";

function Signup() {

    // input values for email and password
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    async function registerUser(e) {
        e.preventDefault()
        try {
            const response = await fetch(`api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            const data = await response.json()
            if(data.status === 'OK'){
                navigate('/login')
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

                    <form onSubmit={registerUser}>
                        <label htmlFor="name">Name</label>
                        <input type="text" id='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='your name' />
                        
                        <label htmlFor="email">Email</label>
                        <input type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='example@gmail.com' />

                        <label htmlFor="password" className='password-label'>Password</label>
                        <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='********'/>

                        <button className='btn login-btn'>
                            Sign up
                            {/* icon */}
                        </button>
                    </form>

                    <p>or continue with</p>

                    <button className='btn google-btn'>
                        <FcGoogle size={22}/>
                    </button>

                    <p className='login-line'>Alreadt have an account? <a href='/login'>login for free</a></p>
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

export default Signup