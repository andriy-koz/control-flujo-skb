import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './navbar.module.css'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav>
      <Link to='/'>Inicio</Link>
      {localStorage.getItem('token') ? (
        <button onClick={handleLogout}>Cerrar sesión</button>
      ) : (
        <>
          <Link to='/login'>Iniciar sesión</Link>
          <Link to='/register'>Registrarse</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar
