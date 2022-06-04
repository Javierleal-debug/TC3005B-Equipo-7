import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSessionData } from '../../global-context'
import { checkAuth, redirectIfUserTypeIsNot } from '../../util'




const UserDetails = () => {
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { sessionData, setSessionData } = useSessionData()

  const location = useLocation()

  useEffect(() => {
    if (sessionData.userType) {
      redirectIfUserTypeIsNot(sessionData, 'admin')
    }
  }, [])

  useEffect(() => {
    checkAuth(sessionData, setSessionData, "#/login")
    getItemRequest()
  }, [])

  const getItemRequest = () => {
    // email=(decodeURIComponent(location.pathname.split("email=")[1]))
    var encodedEmail=location.pathname.split("/users/")[1]
    setIsDataLoading(true)
    const userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    const requestRowData = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      },
    }

    axios
      .get(
        `http://localhost:3001/user/${encodedEmail}`,
        requestRowData
      )
      .then(({ data }) => {
        console.log(data)
        setIsDataLoading(false)
      })
      .catch((e) => {
        console.log(e)
        //window.location.hash = 'not-found'
      })
  }

  return (
    <div></div>
  )
}
export default UserDetails