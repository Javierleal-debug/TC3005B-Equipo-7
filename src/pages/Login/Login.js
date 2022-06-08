import {
  Button,
  Form,
  TextInput,
  InlineLoading,
  ButtonSet,
  Stack,
  ToastNotification
} from 'carbon-components-react'
import React, { useState, useEffect } from 'react'

import { useSessionData } from '../../global-context'
import { checkAuth, getUserType } from '../../util'

const Login = () => {
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const { sessionData, setSessionData } = useSessionData()
  const [isEmailInvalid, setIsEmailInvalid] = useState(false)
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false)
  const [isEmailIncorrect, setIsEmailIncorrect] = useState(false)
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false)
  const [isForgotPasswordNotificationActive,setIsForgotPasswordNotificationActive] = useState(false)
  
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


    if (sessionData.loggedIn && localStorage.getItem('UserInfo')) {
      checkAuth(sessionData, setSessionData, redirect)
      window.location.hash = redirect
    }

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
      }else{
        setIsEmailIncorrect(true)
        setIsPasswordIncorrect(true)
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setIsRequestLoading(false)
    }
  }

  function handleChangeEmail(event) {
    setInput({ ...input, email: event.target.value })
    let email = event.target.value
    let beforeA, betweenAP, afterP
    try{
      beforeA = email.split("@")[0]
      betweenAP = email.split("@")[1].split(".")[0]
      afterP = email.split(".")[1]
      if(email==="" || !email.includes("@") || !email.includes(".") || beforeA==="" || betweenAP==="" || afterP===""){
        setIsEmailInvalid(true)
      }else{
        setIsEmailInvalid(false)
      }
    }catch(e){
      setIsEmailInvalid(true)
    }
    if(isEmailIncorrect){
      setIsEmailIncorrect(false)
    }
  }

  function handleChangePwd(event) {
    setInput({ ...input, pwd: event.target.value })
    if(event.target.value===""){
      setIsPasswordInvalid(true)
    }else{
      setIsPasswordInvalid(false)
    }
    if(isPasswordIncorrect){
      setIsPasswordIncorrect(false)
    }
  }

  return (
    <>
      <div className="login-background">
        <Form>
          <div className="form-header">
            <h2>Sign in</h2>
            <p>Please sign in with your Peripheral Loans Credentials</p>
          </div>
          <Stack className="login-text-input-container" gap={6}>
            <TextInput
              onChange={handleChangeEmail}
              type="text"
              id="email"
              placeholder="Email here"
              labelText="Email"
              invalid={isEmailIncorrect}
              warn={isEmailInvalid}
              warnText="Please specify a valid email address"
              required
            />
            <TextInput.PasswordInput
              onChange={handleChangePwd}
              type="password"
              id="pwd"
              placeholder="Password here"
              labelText="Password"
              invalid={isPasswordIncorrect}
              invalidText="Incorrect Email or Password"
              warn={isPasswordInvalid}
              warnText="Please specify a valid password"
              required
            />
          </Stack>

          <ButtonSet className="login-btn-set">
            <Button kind="ghost" onClick={()=>setIsForgotPasswordNotificationActive(true)}>Forgot Password?</Button>
            <Button
              type="submit"
              kind="primary"
              disabled={isRequestLoading}
              onClick={() => {
                let allowPopUp = true

                if(input.email===""){
                  setIsEmailInvalid(true)
                  allowPopUp = false
                }
                if(input.pwd===""){
                  setIsPasswordInvalid(true)
                  allowPopUp = false
                }

                if(allowPopUp && !isEmailInvalid){
                  signIn()
                }
              }}
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
      {isForgotPasswordNotificationActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="info"
          lowContrast={true}
          title="Password Change"
          onCloseButtonClick={()=>{setIsForgotPasswordNotificationActive(false)}}
          onClose={()=>{setIsForgotPasswordNotificationActive(false)}}
          timeout={5000}
          subtitle="Please contact an app admin for password change."/>
      </div> : <div></div>}
      </div>
    </>
  )
}

export default Login
