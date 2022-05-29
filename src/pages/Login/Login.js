import {
  Button,
  Form,
  TextInput,
  InlineLoading,
  ButtonSet,
} from 'carbon-components-react'
import React, { useState, useEffect } from 'react'

import { useSessionData } from '../../global-context'
import { getUserType } from '../../util'

const Login = () => {
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const { sessionData, setSessionData } = useSessionData()
  const [input, setInput] = useState({
    email: '',
    pwd: '',
  })

  useEffect(() => {
    /*
    let redirect =
      sessionData.redirect === '/login' ? '/devices' : sessionData.redirect
    if (!redirect) redirect = '/devices'

    console.log(redirect)

    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))

    if (sessionData.loggedIn && !userInfo) window.location.hash = redirect
    */

    let redirect = '/devices'

    if (sessionData.redirect && sessionData.redirect !== '/login')
      redirect = sessionData.redirect

    console.log(redirect)

    if (sessionData.loggedIn && localStorage.getItem('UserInfo'))
      window.location.hash = redirect

    // eslint-disable-next-line
  }, [sessionData])

  const signIn = async () => {
    setIsRequestLoading(true)

    try {
      const res = await fetch(
        'https://peripheralsloanbackend.mybluemix.net/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            email: input.email,
            pwd: input.pwd,
          }),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }
      )
      const json = await res.json()
      const userType = await getUserType(json.accessToken)
      if (json.accessToken && userType) {
        localStorage.setItem('UserInfo', JSON.stringify(json))
        setSessionData({
          ...sessionData,
          loggedIn: true,
          email: input.email,
          userType: userType,
        })
      }
      setIsRequestLoading(false)
    } catch (e) {
      console.log(e)
      alert(e.message)
    } finally {
    }
  }

  function handleChangeEmail(event) {
    setInput({ ...input, email: event.target.value })
  }

  function handleChangePwd(event) {
    setInput({ ...input, pwd: event.target.value })
  }

  return (
    <div className="login-background">
      <Form>
        <div className="form-header">
          <h2>Sign in</h2>
          <p>Please sign in with your Peripheral Loans Credentials</p>
        </div>
        <TextInput
          onChange={handleChangeEmail}
          type="text"
          id="email"
          placeholder="Email here"
          labelText="Email"
          required
        />
        <TextInput.PasswordInput
          onChange={handleChangePwd}
          type="password"
          id="pwd"
          placeholder="Password here"
          labelText="Password"
          required
        />
        <ButtonSet className="login-btn-set">
          <Button kind="ghost">Create an account</Button>
          <Button
            type="submit"
            kind="primary"
            onClick={signIn}
            disabled={isRequestLoading}
            size="xl"
          >
            {isRequestLoading ? (
              <InlineLoading description="Loading..." />
            ) : (
              'Sign in'
            )}
          </Button>
        </ButtonSet>
      </Form>
    </div>
  )
}

export default Login
