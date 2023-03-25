import React, { useState } from 'react'
import { updateProgress } from '../../services/productionService'

const UpdateProgressForm = ({ orderId, stage, onUpdateProgress }) => {
  const [quantity, setQuantity] = useState('')

  const handleQuantityChange = e => {
    setQuantity(e.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const newProgress = await updateProgress(orderId, stage, quantity)
    setQuantity('')
    onUpdateProgress(newProgress)
  }

  return (
    <form onSubmit={handleSubmit} className={'form'}>
      <label htmlFor='quantity'>Cantidad:</label>
      <input
        type='number'
        id='quantity'
        name='quantity'
        value={quantity}
        onChange={handleQuantityChange}
        required
      />
      <button type='submit'>Actualizar progreso</button>
    </form>
  )
}

export default UpdateProgressForm
