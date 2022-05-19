import React, { useState, useContext } from 'react'

/**
 * User type context
 */

const UserTypeContext = React.createContext()

function UserTypeProvider({ children }) {
  const [userType, setUserType] = useState('focal')

  const value = { userType, setUserType }
  return (
    <UserTypeContext.Provider value={value}>
      {children}
    </UserTypeContext.Provider>
  )
}

function useUserType() {
  const context = useContext(UserTypeContext)
  if (context === undefined) {
    throw new Error('useUserType must be used within a UserTypeProvider')
  }
  return context
}

export { UserTypeProvider, useUserType }
