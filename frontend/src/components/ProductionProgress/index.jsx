import React, { useState, useEffect } from 'react'
import { getProgress } from '../../services/productionService'

const ProductionProgress = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchProgress = async () => {
      const progressData = await getProgress()
      setOrders(progressData)
    }

    fetchProgress()
  }, [])

  return (
    <div>
      <h2>Ordenes generadas:</h2>
      <table className={'table'}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Modelo</th>
            <th>Cantidad</th>
            <th>Terminados</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.model_name}</td>
              <td>{order.order_quantity}</td>
              <td>{order.production_progress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductionProgress
