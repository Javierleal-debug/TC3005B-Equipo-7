import { InlineNotification, Loading } from 'carbon-components-react'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'


function UserAgreementConfirmation() {
  const { serialNumberUrl } = useParams()
  const [serialNumber, setSerialNumber] = useState('')
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [success, setSuccess] = useState(true)

  const requestConfirmation = async () => {
    setIsDataLoading(true)

    try {
      console.log(serialNumberUrl)
      const res = await fetch(
        `https://peripheralsloanbackend.mybluemix.net/peripheral/accept/${serialNumberUrl}`
      )
      const resJSON = await res.json()
      console.log(resJSON.message)
      setSerialNumber(resJSON.serialNumber)
      if (resJSON.message !== 'Success') setSuccess(false)
    } catch (e) {
      console.log(e)
      setSuccess(false)
    }

    setIsDataLoading(false)
  }

  useEffect(() => {
    requestConfirmation()
    // eslint-disable-next-line
  }, [])

  return (
    // TODO notifications
    <div className="confirmation-container">
      <h1>Peripheral Loan Request</h1>

      {isDataLoading ? (
        <Loading />
      ) : success ? (
        <div className="loan-data-container confirmation-success">
          <QRCode
            value={`https://peripheral-loans-equipo7.mybluemix.net/#/devices/${serialNumber}`}
            size={194}
            className="confirmation-qr"
          />

          <p>You successfuly accepted the user agreement.</p>
          <p>
            Please contact the corresponding focal to finish the process and get
            the requested device.
          </p>
          <p>
            Show this QR code (it's also in the email you got) to security when
            required.{' '}
          </p>
        </div>
      ) : (
        <div className="loan-data-container confirmation-fail">
          <p>
            Something went wrong. Please contact the administrator to solve this
            issue.
          </p>
        </div>
      )}
    </div>
  )
}

export default UserAgreementConfirmation
