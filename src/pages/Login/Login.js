import axios from 'axios'
import { Button, Form,TextInput } from 'carbon-components-react'
import React from 'react'
import credentials from './credentials.json'




const state={
  email:'',
  pwd:''
}

function signIn(){
  alert(`inicio de sesion ${state.email} ${state.pwd}`)
  const authUrl = 'https://iam.cloud.ibm.com/identity/token'; 
  const authData = `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${ credentials.ApiKey }`;
  const authConf = {
    Headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    }
  };
  console.log("hola 1")
  axios.post( authUrl, authData, authConf )
    .then( response => {
        console.log("hola 2")
        // Making query
        const token = response.data.access_token
        const queryURL="https://bpe61bfd0365e9u4psdglite.db2.cloud.ibm.com/dbapi/v4/sql_jobs";
        const queryData = {
            "commands":`SELECT * FROM USERSDATABASE where email='${state.email}';`,
            "limit":10,
            "separator":";",
            "stop_on_error":"no"
        }
        const queryConf = {
            headers: {
                "authorization": `Bearer ${token}`,
                "csontent-Type": 'application/json',
                "x-deployment-id": credentials.DB_DEPLOYMENT_ID,
                "Access-Control-Allow-Origin":"*",
                'Access-Control-Allow-Credentials':true
            }
        }
        axios.post(queryURL,queryData,queryConf)
        .then(response => {

            const getDataUrl = `${queryURL}/${response.data.id}`
            axios.get(getDataUrl,queryConf)
                .then(response => console.log(response.data.results[0].rows))
        })
            
            
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
