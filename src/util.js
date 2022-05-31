import { useEffect } from 'react'
import { useSessionData } from './global-context'

export function useAuthorizer() {
  const { sessionData, setSessionData } = useSessionData()

  useEffect(() => {
    checkAuth(sessionData, setSessionData)
    // eslint-disable-next-line
  }, [])
}

export function checkAuth(sessionData, setSessionData, redirect) {
  if (!localStorage.getItem('UserInfo')) {
    setSessionData({ ...sessionData, loggedIn: false, redirect: redirect })
    return
  }
  var userInfo = JSON.parse(localStorage.getItem('UserInfo'))

  fetch('https://peripheralsloanbackend.mybluemix.net/auth/hasAccess', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'x-access-token': userInfo['accessToken'],
    },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.access) {
        setSessionData({
          ...sessionData,
          loggedIn: true,
          email: userInfo['email'],
        })
      } else {
        localStorage.removeItem('UserInfo')
        setSessionData({
          userType: '',
          accessToken: '',
          loggedIn: false,
          email: '',
          name: 'Name Example',
        })
      }
      return getUserType(userInfo['accessToken'])
    })
    .then((userType) => {
      setSessionData({ ...sessionData, userType: userType })
    })
    .catch((e) => console.log(e))
}

export const getDeviceStatus = (conditions, inside, security, currentUser) => {
  if (
    currentUser === '' &&
    conditions === 'false' &&
    inside === 'true' &&
    security === 'false'
  ) {
    return 'Available'
  } else if (currentUser !== '' && inside === 'true' && security === 'false') {
    return 'Requested'
  } else if (
    conditions === 'true' &&
    inside === 'false' &&
    security === 'true' &&
    currentUser !== ''
  ) {
    return 'Borrowed'
  } else {
    return 'Invalid'
  }
}

export async function getUserType(accessToken) {
  var myHeaders = new Headers()
  myHeaders.append('x-access-token', accessToken)

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  }

  try {
    const res = await fetch(
      'https://peripheralsloanbackend.mybluemix.net/auth/userType',
      requestOptions
    )
    const resJSON = await res.json()

    switch (resJSON.value) {
      case '0':
        return 'admin'
      case '1':
        return 'focal'
      case '2':
        return 'security'
      default:
        break
    }
  } catch (e) {
    console.log(e)
  }
}

export function redirectIfUserTypeIsNot(sessionData, ...userTypes) {
  let valid = false

  userTypes.forEach((type) => {
    if (type === sessionData.userType) valid = true
  })

  if (!valid) window.location.hash = '/'
}
