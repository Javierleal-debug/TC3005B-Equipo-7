import {
  Button,
  Column,
  Form,
  Grid,
  TextInput,
  InlineLoading,
  ButtonSet,
} from 'carbon-components-react'
import React, { useState } from 'react'

import { useSessionData } from '../../global-context'

const LandingPage = () => {
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const { sessionData, setSessionData } = useSessionData()

  const state = {
    email: '',
    pwd: '',
  }

  const signIn = () => {
    setIsRequestLoading(true)
    let signedIn = false

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
        } else {
          alert('Wrong user or password')
        }
      })
      .then(() => {
        setSessionData({ ...sessionData, loggedIn: signedIn })
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
    <Grid className="page-content">
      <Column sm={4} md={8} lg={6} className="actions-block">
        <h1>Peripheral Loans</h1>
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
          <ButtonSet>
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
      </Column>
    </Grid>
  )
}

export default LandingPage
