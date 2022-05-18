export function checkAuth() {
  var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
  console.log('checkauth')
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
      } else {
        window.location.hash = '/login'
      }
    })
}
