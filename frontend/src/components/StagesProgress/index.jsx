import React, { useState, useEffect } from 'react'
import { getSumOfEverySector } from '../../services/productionService'

const StagesProgress = () => {
  const [stages, setStages] = useState([])

  useEffect(() => {
    const fetchStagesProgress = async () => {
      const stagesData = await getSumOfEverySector()
      setStages(stagesData.result)
    }

    fetchStagesProgress()
  }, [])

  return (
    <div>
      <h2>Progreso de orden actual:</h2>
      <table className={'table'}>
        <thead>
          <tr>
            <th>Etapa</th>
            <th>Equipos enviados</th>
          </tr>
        </thead>
        <tbody>
          {stages.map(stage => (
            <tr key={stage.stage}>
              <td>{stage.stage}</td>
              <td>{stage.total_equipment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StagesProgress
