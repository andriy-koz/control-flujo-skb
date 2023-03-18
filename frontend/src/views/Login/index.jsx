import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          username,
          password,
        }
      )

      const token = response.data.token
      const role = response.data.role
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      navigate('/production-flow')
    } catch (err) {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className={'container'}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className={'form'}>
        <div>
          <label>Usuario:</label>
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button className={'button'} type='submit'>
          Iniciar sesión
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  )
}

export default Login
