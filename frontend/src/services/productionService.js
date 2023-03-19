import axios from 'axios'
const API_URL = process.env.REACT_APP_BACKEND_URL // Reemplazar con la URL de tu API

export const getProgress = async orderId => {
  try {
    const response = await fetch(
      `${API_URL}/api/production/progress/${orderId}`
    )
    const data = await response.json()

    if (response.ok) {
      return data.progress
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error fetching progress:', error)
    throw error
  }
}

export const createOrder = async (model, targetQuantity) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/production/start-production`,
      {
        model,
        targetQuantity,
      }
    )
    return response.data.orderId
  } catch (error) {
    console.error('Error al crear la orden:', error)
  }
}

export const updateProgress = async (orderId, stage, quantity) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/production/update-progress`,
      {
        orderId,
        stage,
        quantity,
      }
    )
    return response.data.newProgress
  } catch (err) {
    throw new Error('An error occurred while updating production progress.')
  }
}

export const getSumProgress = async stage => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/production/sum-progress/${stage}`
    )
    return response.data
  } catch (err) {
    throw new Error('An error occurred while fetching sum of progress.')
  }
}
