import React, { useState, useEffect } from 'react'
import ProductionProgress from '../ProductionProgress'
import { createOrder } from '../../services/productionService'
import './productionFlow.module.css'

const ProductionFlow = () => {
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [orderId, setOrderId] = useState(null)
  const [model, setModel] = useState('')
  const [targetQuantity, setTargetQuantity] = useState('')
  const [newOrderId, setNewOrderId] = useState(null)

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

  const handleOrderIdChange = e => {
    setOrderId(e.target.value)
  }

  const handleModelChange = e => {
    setModel(e.target.value)
  }

  const handleTargetQuantityChange = e => {
    setTargetQuantity(e.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const createOrderId = await createOrder(model, targetQuantity)
    setNewOrderId(createOrderId)
    setModel('')
    setTargetQuantity('')
  }

  const renderContent = () => {
    switch (role) {
      case 'SKB User':
        return (
          <>
            <p>Contenido para el usuario de SKB.</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor='model'>Modelo:</label>
              <input
                type='text'
                id='model'
                name='model'
                value={model}
                onChange={handleModelChange}
                required
              />
              <label htmlFor='targetQuantity'>Cantidad objetivo:</label>
              <input
                type='number'
                id='targetQuantity'
                name='targetQuantity'
                value={targetQuantity}
                onChange={handleTargetQuantityChange}
                required
              />
              <button type='submit'>Crear nueva orden</button>
            </form>
            <input
              type='number'
              placeholder='Ingrese el ID de la orden'
              onChange={handleOrderIdChange}
            />
            {orderId && <ProductionProgress orderId={orderId} />}
          </>
        )
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
      {newOrderId && (
        <p>Orden creada con éxito. ID de la orden: {newOrderId}</p>
      )}
    </div>
  )
}

export default ProductionFlow
