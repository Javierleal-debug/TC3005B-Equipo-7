import React, { useState, useContext } from 'react'

/**
 * User type context
 */

/**
 * Session data context
 */

const SessionDataContext = React.createContext()

function SessionDataProvider({ children }) {
  const [sessionData, setSessionData] = useState({
    userType: 'focal',
    accessToken: '',
    loggedIn: false,
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
