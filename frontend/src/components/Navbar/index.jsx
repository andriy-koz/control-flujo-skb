import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './navbar.module.css'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
    <nav className={'navbar'}>
      <Link to='/'>Inicio</Link>
      {localStorage.getItem('token') ? (
        <>
          <Link to='/production-flow'>Seguimiento de producción</Link>
          <Link to='/' onClick={handleLogout}>
            Cerrar sesión
          </Link>
        </>
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
