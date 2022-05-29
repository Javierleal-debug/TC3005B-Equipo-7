import React, { useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * User type context
 */

/**
 * Session data context
 */

const SessionDataContext = React.createContext()

function SessionDataProvider({ children }) {
  const location = useLocation()

  const [sessionData, setSessionData] = useState({
    userType: '',
    accessToken: '',
    loggedIn: true,
    email: '',
    name: 'Name Example',
    redirect: location.pathname,
  })

  const value = { sessionData, setSessionData }
  return (
    <SessionDataContext.Provider value={value}>
      {children}
    </SessionDataContext.Provider>
  )
}

function useSessionData() {
  const context = useContext(SessionDataContext)
  if (context === undefined) {
    throw new Error('useSessionData must be used within a SessionDataProvider')
  }
  return context
}

export { SessionDataProvider, useSessionData }
