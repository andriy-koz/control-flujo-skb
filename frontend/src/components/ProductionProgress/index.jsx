import React, { useState, useEffect } from 'react'
import { getProgress } from '../../services/productionService'

const ProductionProgress = ({ orderId }) => {
  const [progress, setProgress] = useState([])

  useEffect(() => {
    const fetchProgress = async () => {
      const progressData = await getProgress(orderId)
      setProgress(progressData)
    }

    fetchProgress()
  }, [orderId])

  console.log(progress)
  return (
    <div>
      <h2>Progreso de la orden: {orderId}</h2>
      <table>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Cantidad</th>
            <th>Fecha de creación</th>
          </tr>
        </thead>
        <tbody>
          {progress.map(item => (
            <tr key={item.model}>
              <td>{item.model}</td>
              <td>{item.target_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductionProgress
