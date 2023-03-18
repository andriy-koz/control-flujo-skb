import React, { useState, useEffect } from 'react'
import './productionFlow.module.css'

const ProductionFlow = () => {
  const [role, setRole] = useState(localStorage.getItem('role'))

  useEffect(() => {
    const handleStorageChange = e => {
      if (e.key === 'role') {
        setRole(localStorage.getItem('role'))
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const renderContent = () => {
    switch (role) {
      case 'SKB User':
        return <p>Contenido para el usuario de SKB.</p>
      case 'Mecanizado User':
        return <p>Contenido para el usuario de Mecanizado.</p>
      case 'Soldadura User':
        return <p>Contenido para el usuario de Soldadura.</p>
      case 'Esmalteria User':
        return <p>Contenido para el usuario de Esmalteria.</p>
      case 'Montaje User':
        return <p>Contenido para el usuario de Montaje.</p>
      default:
        return <p>Contenido no disponible para el rol actual.</p>
    }
  }
  return (
    <div className={'container'}>
      <h1>Página de seguimiento del flujo de producción</h1>
      {renderContent()}
    </div>
  )
}

export default ProductionFlow
