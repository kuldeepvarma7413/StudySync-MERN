import React from 'react'
import { NavLink } from 'react-router-dom'

function Unauthorized() {
  return (
    <div style={{width: "100%", textAlign:"center"}}>Unauthorized Access. please <u><NavLink to={'/login'}>Login</NavLink></u></div>
  )
}

export default Unauthorized