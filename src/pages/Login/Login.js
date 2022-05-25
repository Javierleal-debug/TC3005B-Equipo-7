import {
  Button,
  Form,
  TextInput,
  InlineLoading,
  ButtonSet,
} from 'carbon-components-react'
import React, { useState } from 'react'

import { useSessionData } from '../../global-context'

const Login = () => {
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const { sessionData, setSessionData } = useSessionData()

  const state = {
    email: '',
    pwd: '',
  }

  const signIn = () => {
    setIsRequestLoading(true)
    let signedIn = false
    setSessionData({
      ...sessionData,
      email: state.email,
      loggedIn: signedIn,
    })

    fetch('https://peripheralsloanbackend.mybluemix.net/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: state.email,
        pwd: state.pwd,
      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json.accessToken)
        if (json.accessToken) {
          localStorage.setItem('UserInfo', JSON.stringify(json))
          signedIn = true
          window.location.hash = '/devices'
        }
      })
      .catch((e) => {
        console.log(e)
        alert('Wrong user or password')
      })
      .finally(() => {
        setIsRequestLoading(false)
      })
  }

  function handleChangeEmail(event) {
    state.email = event.target.value
  }

  function handleChangePwd(event) {
    state.pwd = event.target.value
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
