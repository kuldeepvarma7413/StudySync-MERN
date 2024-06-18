import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'


function Dashboard() {

    const navigate = useNavigate()    
    async function populateCode(){
        const response = await fetch(`https://studysync-uunh.onrender.com/`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
        const data = await response.json()
        console.log(data)
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            const user = jwtDecode(token)
            if(!user){
                localStorage.removeItem('token')
                navigate('/login')
            }else{
                populateCode()
            }
        }
    }, []);
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard