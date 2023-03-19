import React, { useState, useEffect } from 'react'
import ProductionProgress from '../ProductionProgress'
import UpdateProgressForm from './UpdateProgressForm'
import { createOrder, getSumProgress } from '../../services/productionService'
import './productionFlow.module.css'
import axios from 'axios'
const API_URL = process.env.REACT_APP_BACKEND_URL

const ProductionFlow = () => {
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [orderId, setOrderId] = useState(null)
  const [model, setModel] = useState('')
  const [targetQuantity, setTargetQuantity] = useState('')
  const [newOrderId, setNewOrderId] = useState(null)
  const [sumProgress, setSumProgress] = useState(0)

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

  useEffect(() => {
    if (
      role === 'Mecanizado User' ||
      role === 'Soldadura User' ||
      role === 'Esmalteria User' ||
      role === 'Montaje User'
    ) {
      fetchLatestOrderId()
    }
  }, [role])

  useEffect(() => {
    const fetchSumProgress = async () => {
      try {
        const sum = await getSumProgress(role.split(' ')[0].toLowerCase())
        setSumProgress(sum)
      } catch (error) {
        console.error(error)
      }
    }

    if (role !== 'SKB User') {
      fetchSumProgress()
    }
  }, [role, sumProgress])

  const fetchLatestOrderId = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/production/latest-order`)
      setOrderId(response.data.orderId)
    } catch (error) {
      console.error('Error fetching the latest order ID:', error)
    }
  }

  const handleUpdateProgress = newProgress => {
    setSumProgress(newProgress)
  }

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
        return (
          <>
            <p>Contenido para el usuario de Mecanizado.</p>
            <p>Equipos enviados: {sumProgress}</p>
            {orderId && (
              <UpdateProgressForm
                orderId={orderId}
                stage='mecanizado'
                onUpdateProgress={handleUpdateProgress}
              />
            )}
          </>
        )
      case 'Soldadura User':
        return (
          <>
            <p>Contenido para el usuario de Soldadura.</p>
            <p>Equipos enviados: {sumProgress}</p>
            {orderId && (
              <UpdateProgressForm
                orderId={orderId}
                stage='soldadura'
                onUpdateProgress={handleUpdateProgress}
              />
            )}
          </>
        )
      case 'Esmalteria User':
        return (
          <>
            <p>Contenido para el usuario de Esmalteria.</p>
            <p>Equipos enviados: {sumProgress}</p>
            {orderId && (
              <UpdateProgressForm
                orderId={orderId}
                stage='esmalteria'
                onUpdateProgress={handleUpdateProgress}
              />
            )}
          </>
        )
      case 'Montaje User':
        return (
          <>
            <p>Contenido para el usuario de Montaje.</p>
            <p>Equipos enviados: {sumProgress}</p>
            {orderId && (
              <UpdateProgressForm
                orderId={orderId}
                stage='montaje'
                onUpdateProgress={handleUpdateProgress}
              />
            )}
          </>
        )
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
