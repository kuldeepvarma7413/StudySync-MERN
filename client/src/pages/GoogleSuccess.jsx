import React from 'react'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'

function GoogleSuccess() {
  document.title = "Success | StudySync";
    const param = useParams();
    // save token to local storage and redirect to home route
    Cookies.set("token", param.token);
    window.location.href = "/";
  return (
    <div style={{display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
        Successfully logged in with Google
    </div>
  )
}

export default GoogleSuccess