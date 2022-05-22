export function checkAuth(sessionData, setSessionData) {
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
        setSessionData({ ...sessionData, loggedIn: true })
      } else {
        window.location.hash = '/login'
        setSessionData({ ...sessionData, loggedIn: false })
      }
    })
}

export const getDeviceStatus = (conditions, inside, security, currentUser) => {
  if (
    currentUser === '' &&
    conditions === 'false' &&
    inside === 'true' &&
    security === 'false'
  ) {
    return 'Available'
  } else if (
    currentUser !== '' &&
    conditions === 'false' &&
    inside === 'true' &&
    security === 'false'
  ) {
    return 'Requested'
  } else if (
    currentUser !== '' &&
    conditions === 'true' &&
    inside === 'true' &&
    security === 'false'
  ) {
    return 'Borrowed'
  } else if (
    currentUser !== '' &&
    conditions === 'true' &&
    inside === 'false' &&
    security === 'true'
  ) {
    return 'Borrowed'
  } else {
    return 'Invalid'
  }
}
