import React from 'react'
import { useParams } from 'react-router-dom'

function GoogleSuccess() {
    const param = useParams();
    // save token to local storage and redirect to home route
    localStorage.setItem("token", param.token);
    window.location.href = "/";
  return (
    <div style={{display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
        Successfully logged in with Google
    </div>
  )
}

export default GoogleSuccess