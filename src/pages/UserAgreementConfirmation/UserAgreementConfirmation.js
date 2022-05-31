import { InlineNotification } from 'carbon-components-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function UserAgreementConfirmation() {
  const { serialNumber } = useParams()
  const [isDataLoading, setIsDataLoading] = useState(false)

  const requestConfirmation = async () => {
    setIsDataLoading(true)
    // TODO fetch a ruta de confirmación
    setIsDataLoading(false)
  }

  useEffect(() => {
    requestConfirmation()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <InlineNotification></InlineNotification>
    </>
  )
}

export default UserAgreementConfirmation
