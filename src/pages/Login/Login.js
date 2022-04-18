import { Button, Form,TextInput } from 'carbon-components-react'
import React from 'react'

const LandingPage = () => {
  return(
    <div>
      <div class="loginTitle">
        Sign in with your Peripheral Loans Credentials
      </div>
      <div class="loginInstructions">
        Use your Email and Password
      </div>

      <Form>
        <div class="textinput">
          <TextInput
          type="text"
          id="email"
          placeholder="Email here"
          labelText="Email"
          />

        </div>
        <div class="textinput">
          <TextInput
          type="password"
          id="pwd"
          placeholder="Password here"
          labelText="Password"
          />
        </div>
        <div class="textinput">
          <Button>
            Sign in
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default LandingPage
