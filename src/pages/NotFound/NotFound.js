import React, { useEffect } from 'react'

import { checkAuth } from '../../util'
import { useSessionData } from '../../global-context'
import { useLocation } from 'react-router-dom'

function NotFound() {
  const { sessionData, setSessionData } = useSessionData()
  const location = useLocation()

  useEffect(() => {
    checkAuth(sessionData, setSessionData, location.pathname)
    // eslint-disable-next-line
  }, [])

  return (
    <div className="not-found-container">
      <h1>Error 404</h1>
      <p>&#9432; The page you are looking for doesn't exist.</p>
    </div>
  )
}

export default NotFound
