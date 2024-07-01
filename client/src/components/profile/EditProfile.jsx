import React from 'react'
import { useLocation } from 'react-router-dom'

function EditProfile() {
    const user = useLocation().state.user

  return (
    <div>EditProfile</div>
  )
}

export default EditProfile