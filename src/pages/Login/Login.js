import { Button, Form,TextInput } from 'carbon-components-react'
import React from 'react'
import {Link,useHref,useNavigate} from 'react-router-dom'




const state={
  email:'',
  pwd:''
}

function signIn(){
  //alert(`inicio de sesion ${state.email} ${state.pwd}`)
  fetch("https://peripheralsloanbackend.mybluemix.net/auth/login", {
        method: 'POST',
        body: JSON.stringify({
            email: state.email,
            pwd: state.pwd}),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(json => {
      console.log(json.accessToken);
      if (json.accessToken){
        localStorage.setItem('UserInfo',JSON.stringify(json));
        window.location.hash="/devices"
      }else{
        alert("Wrong user or password");
        
      }
    });
}

function handleChangeEmail(event){
  state.email=event.target.value
}

function handleChangePwd(event){
  state.pwd=event.target.value
}

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
          onChange={handleChangeEmail}
          type="text"
          id="email"
          placeholder="Email here"
          labelText="Email"
          />

        </div>
        <div class="textinput">
          <TextInput.PasswordInput
          onChange={handleChangePwd}
          type="password"
          id="pwd"
          placeholder="Password here"
          labelText="Password"
          />
        </div>
        <div class="textinput">
          <Button
          onClick={signIn}>
            Sign in
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default LandingPage
