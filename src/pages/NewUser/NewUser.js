import React, { useState, useEffect } from 'react'

import axios from 'axios'

// Carbon Styling
import {
  Grid,
  Column,
  Button,
  ButtonSet,
  Stack,
  TextInput,
  Dropdown,
  Modal,
  InlineLoading,
  ToastNotification
} from 'carbon-components-react'
import { Misuse, Save } from '@carbon/icons-react'
import { useSessionData } from '../../global-context'
import { useLocation } from 'react-router-dom'
import { checkAuth, redirectIfUserTypeIsNot } from '../../util'

const userTypes = [
  'Admin',
  'Focal',
  'Security'
]

const CreateUserPopUp = ({ open, setOpen, submit, isDataLoading }) => (
  <Modal
    open={open}
    modalLabel="Peripheral device"
    modalHeading="Create"
    primaryButtonDisabled={isDataLoading}
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Create'
    }
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
    onRequestSubmit={submit}
    danger={false}
  >
    <p>
      By clicking "Create", you understand that this user will be have access to all the registered devices. <b>You will be redirected to the 'User List' page.</b>
    </p>
  </Modal>
)

const userData = {}

const NewUser = () => {
  const [createUserPopUpOpen, setCreateUserPopUpOpen] = useState(false)
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [isNotificationErrorActive, setIsNotificationErrorActive] = useState(false)
  const [isWarningNotificationActive, setIsWarningNotificationActive] = useState(false)

  const [isTypeNotSelected, setIsTypeNotSelected] = useState(false)
  const [isNameInvalid, setIsNameInvalid] = useState(false)
  const [isEmailInvalid, setIsEmailInvalid] = useState(false)
  const [isSerialInvalid, setIsSerialInvalid] = useState(false)
  const [isAreaInvalid, setIsAreaInvalid] = useState(false)
  const [isMngrNameInvalid, setIsMngrNameInvalid] = useState(false)
  const [isMngrEmailInvalid, setIsMngrEmailInvalid] = useState(false)
  const [isPwdInvalid, setIsPwdInvalid] = useState(false)
  const [invalidPasswordText, setInvalidPasswordText] = useState(false)

  const { sessionData, setSessionData } = useSessionData()
  const location = useLocation()

  useEffect(() => {
    checkAuth(sessionData, setSessionData, location.pathname)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (sessionData.userType) {
      redirectIfUserTypeIsNot(sessionData, 'admin')
    }
  }, [sessionData])

  const handleTypeChange = (event) => {
    userData.type = event.selectedItem
  }

  const handleNameChange = (event) => {
    userData.name = event.target.value
  }

  const handleEmailChange = (event) => {
    userData.email = event.target.value
  }

  const handleSerialChange = (event) => {
    userData.serial = event.target.value
  }

  const handleMngrNameChange = (event) => {
    userData.mngrName = event.target.value
  }

  const handleMngrEmailChange = (event) => {
    userData.mngrEmail = event.target.value
  }

  const handlePwdChange = (event) => {
    userData.pwd = event.target.value
  }

  const handleAreaChange = (event) => {
    userData.area = event.target.value
  }

  function getUserTypeId() {
    if(userData.type === "Admin"){
      return 0;
    }else if(userData.type === "Focal"){
      return 1;
    }else {
      return 2;
    }
  }

  const postCreateDevices = () => {
    setIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    let requestData = {
      name: userData.name,
      email: userData.email,
      serial: userData.serial,
      area: userData.area,
      mngrName: userData.mngrName,
      mngrEmail: userData.mngrEmail,
      pwd: userData.pwd,
      userTypeId: `${getUserTypeId()}`
    }
    let requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
        'Content-Type': 'application/json',
      },
    }

    axios
      .post(
        'https://peripheralsloanbackend.mybluemix.net/user/signup',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        setCreateUserPopUpOpen(false)
        setIsRequestLoading(false)
        console.log(data.message)
        
        if(data.message === "Email already registered"){
          setIsWarningNotificationActive(true)
        }else{
          window.location.hash = '/users'
        }
      })
      .catch((error) => {
        setCreateUserPopUpOpen(false)
        setIsRequestLoading(false)
        console.error(`There was an error!`, error)
        setIsNotificationErrorActive(true)
      })
  }

  return (
    <>
      {isNotificationErrorActive ? 
        <div className="error-notification">
          <ToastNotification
            kind="error"
            lowContrast={true}
            title="Error"
            onCloseButtonClick={()=>{setIsNotificationErrorActive(false)}}
            subtitle="Something went wrong, try it later"/>
        </div> 
        : 
        <div></div>
      }
      {isWarningNotificationActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="warning"
          lowContrast={true}
          title="Already exists!"
          onCloseButtonClick={()=>{setIsWarningNotificationActive(false)}}
          subtitle="This user email is already registered"/>
      </div> : <div></div>}
      <CreateUserPopUp
        open={createUserPopUpOpen}
        setOpen={setCreateUserPopUpOpen}
        submit={postCreateDevices}
        isDataLoading={isRequestLoading}
      />
      <Grid className="page-content">
        <Column sm={4} md={8} lg={16}>
          <h1 className="new-device-title">New User</h1>
        </Column>
        <Column sm={4} md={8} lg={8}>
          <Stack>
            <Dropdown
              id="Type"
              onChange={(event) => {
                handleTypeChange(event)
                if(!userData.type){
                  setIsTypeNotSelected(true)
                }else{
                  setIsTypeNotSelected(false)
                }
              }}
              label="Select User Type"
              titleText="Type"
              items={userTypes}
              invalid={isTypeNotSelected}
            />
            <TextInput
              id="Serial"
              onChange={(event) => {
                handleSerialChange(event)
                if(!userData.serial){
                  setIsSerialInvalid(true)
                }else{
                  setIsSerialInvalid(false)
                }
              }}
              className="cds--list-box__wrapper"
              placeholder="User's Serial Number"
              labelText="Serial"
              invalid={isSerialInvalid}
            />
            <TextInput
              id="Area"
              onChange={(event)=>{
                handleAreaChange(event)
                if(!userData.area){
                  setIsAreaInvalid(true)
                }else{
                  setIsAreaInvalid(false)
                }
              }}
              className="cds--list-box__wrapper"
              placeholder="User's Area"
              labelText="Area"
              invalid={isAreaInvalid}
            />
            <div className="cds--list-box__wrapper cds--text-input-wrapper">
              <TextInput.PasswordInput
                type="password"
                id="Password"
                placeholder="Define User Password"
                labelText="Password"
                onChange={(event)=>{
                  handlePwdChange(event)
                  if(!userData.pwd){
                    setIsPwdInvalid(true)
                    setInvalidPasswordText("Please specify a password")
                  }else if (!userData.pwd.match(/^[-.@_A-Za-z0-9 ]+$/)){
                    setIsPwdInvalid(true)
                    setInvalidPasswordText("No special characters, please!")
                  }else{
                    setIsPwdInvalid(false)
                  }
                }}
                invalid={isPwdInvalid}
                invalidText={invalidPasswordText}
              />
            </div>
          </Stack>
        </Column>
        <Column sm={4} md={8} lg={8}>
          <Stack>
          <TextInput
              id="Name"
              onChange={(event) => {
                handleNameChange(event)
                if(!userData.name){
                  setIsNameInvalid(true)
                }else{
                  setIsNameInvalid(false)
                }
              }}
              className="cds--list-box__wrapper"
              placeholder="User Name"
              labelText="Name"
              invalid={isNameInvalid}
            />
            <TextInput
              id="Email"
              onChange={(event)=>{
                handleEmailChange(event)
                if(!userData.email){
                  setIsEmailInvalid(true)
                }else{
                  setIsEmailInvalid(false)
                }
              }}
              className="cds--list-box__wrapper"
              placeholder="User Email"
              labelText="Email"
              invalid={isEmailInvalid}
            />
            <TextInput
              id="MngrName"
              onChange={(event)=>{
                handleMngrNameChange(event)
                if(!userData.mngrName){
                  setIsMngrNameInvalid(true)
                }else{
                  setIsMngrNameInvalid(false)
                }
              }}
              className="cds--list-box__wrapper"
              placeholder="User's Manager's Name"
              labelText="Manager Name"
              invalid={isMngrNameInvalid}
            />
            <TextInput
              id="MngrEmail"
              onChange={(event)=>{
                handleMngrEmailChange(event)
                if(!userData.mngrEmail){
                  setIsMngrEmailInvalid(true)
                }else{
                  setIsMngrEmailInvalid(false)
                }
              }}
              className="cds--list-box__wrapper"
              placeholder="User's Manager's Email"
              labelText="Manager Email"
              invalid={isMngrEmailInvalid}
            />
          </Stack>
        </Column>
        <Column sm={4} md={8} lg={16}>
          <ButtonSet className="new-device-button-set">
            <Button renderIcon={Misuse} kind="secondary" href="#/users">
              Cancel
            </Button>
            <Button
              renderIcon={Save}
              kind="primary"
              type="button"
              onClick={() => {
                let allowPopUp = true

                if(!userData.type){
                  setIsTypeNotSelected(true)
                  allowPopUp = false
                }
                if(!userData.name){
                  setIsNameInvalid(true)
                  allowPopUp = false
                }
                if(!userData.email){
                  setIsEmailInvalid(true)
                  allowPopUp = false
                }
                if(!userData.serial){
                  setIsSerialInvalid(true)
                  allowPopUp = false
                }
                if(!userData.area){
                  setIsAreaInvalid(true)
                  allowPopUp = false
                }
                if(!userData.pwd){
                  setIsPwdInvalid(true)
                  allowPopUp = false
                }
                if(!userData.mngrEmail){
                  setIsMngrEmailInvalid(true)
                  allowPopUp = false
                }
                if(!userData.mngrName){
                  setIsMngrNameInvalid(true)
                  allowPopUp = false
                }

                if(allowPopUp){
                  setCreateUserPopUpOpen(true)
                }else{
                  setCreateUserPopUpOpen(false)
                }
              }}
            >
              Save
            </Button>
          </ButtonSet>
        </Column>
      </Grid>
    </>
  )
}

export default NewUser
