import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSessionData } from '../../global-context'
import { checkAuth, redirectIfUserTypeIsNot } from '../../util'
import { TrashCan, FaceCool, User, Police, UserSettings, Password, UserIdentification } from '@carbon/icons-react'
import {
  Modal,
  TextInput,
  InlineLoading,
  ToastNotification,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Grid,
  Column,
  Button,
  ButtonSet,
  Tag,
  SkeletonText,
  ButtonSkeleton,
  DataTableSkeleton,
  ComboBox
} from 'carbon-components-react'

const DeleteUserPopUp = ({ open, setOpen, submit, isDataLoading }) => (
  <Modal
    open={open}
    modalLabel="User Management"
    modalHeading="Delete"
    primaryButtonDisabled={isDataLoading}
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Delete'
    }
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
    onRequestSubmit={submit}
    danger
  >
    <p>
      By clicking "Delete", you understand that this user will be deleted.
    </p>
  </Modal>
)

const ChangePasswordPopUp = ({ open, setOpen, submit, isDataLoading, handleNewPwdChange, isPwdInvalid, setIsPwdInvalid, invalidPasswordText }) => (
  <Modal
    open={open}
    modalLabel="User Management"
    modalHeading="Change Password"
    primaryButtonDisabled={isDataLoading || isPwdInvalid}
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Change Password'
    }
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
    onRequestSubmit={()=>{
      if(!newPwd){
        setIsPwdInvalid(true)
      }else{
        submit()
      }
    }}
  >
    <p>
      By clicking "Change Password", you understand that this user password will be changed.
    </p>
    <TextInput.PasswordInput
      type="password"
      id="Password"
      placeholder="Define User Password"
      labelText="Password"
      onChange={(event)=>{
        handleNewPwdChange(event)
      }}
      invalid={isPwdInvalid}
      invalidText={invalidPasswordText}
    />
  </Modal>
)

const ChangeUserTypePopUp = ({ open, setOpen, submit, isDataLoading, handleNewUserTypeChange, isTypeNotSelected, setIsTypeNotSelected}) => (
  <Modal
    open={open}
    modalLabel="User Management"
    modalHeading="Change User Type"
    primaryButtonDisabled={isDataLoading || isTypeNotSelected}
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Change User Type'
    }
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
    onRequestSubmit={()=>{
      if(!newUserType){
        setIsTypeNotSelected(true)

      }else{
        submit()
      }
    }}
  >
    <p>
      By clicking "Change User Type", you understand that this user features will be changed.
    </p>
    <ComboBox
      id="Type"
      onChange={(event) => {
        handleNewUserTypeChange(event)
      }}
      label="Select User Type"
      titleText="Type"
      items={userTypes}
      invalid={isTypeNotSelected}
      invalidText={"Please select a user type"}
    />
  </Modal>
)

const ChangeMngrPopUp = ({ open, setOpen, submit, isDataLoading, handleMngrChange, isMngrNotSelected, setIsMngrNotSelected}) => (
  <Modal
    open={open}
    modalLabel="User Management"
    modalHeading="Change User Type"
    primaryButtonDisabled={isDataLoading || isMngrNotSelected}
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Change Manager'
    }
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
    onRequestSubmit={()=>{
      if(!newMngr){
        setIsMngrNotSelected(true)
      } else {
        submit()
      }
    }}
  >
    <p>
      By clicking "Change Manager", you understand that user manager will be changed.
    </p>
    <ComboBox
      id="MngrEmail"
      onChange={(event) => {
        handleMngrChange(event)
      }}
      label="Select Manager Email"
      titleText="Manager Email"
      items={mngrs}
      invalid={isMngrNotSelected}
      invalidText={"Prease select a Manager"}
    />
  </Modal>
)

var userData = {
  name: "",
  email: "",
  serial: "",
  area: ""
}

const userTypes = ['Admin','Focal','Security']
var mngrs = []
var newPwd, newUserType, newMngr

const UserDetails = () => {
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { sessionData, setSessionData } = useSessionData()
  const [deleteUserPopUpOpen, setDeleteUserPopUpOpen] = useState(false)
  const [changePasswordPopUpOpen, setChangePasswordPopUpOpen] = useState(false)
  const [changeUserTypePopUpOpen, setChangeUserTypePopUpOpen] = useState(false)
  const [changeMngrPopUpOpen, setChangeMngrPopUpOpen] = useState(false)
  const [userType, setUserType] = useState("")
  const [mngrName, setMngrName] = useState("")
  const [mngrEmail, setMngrEmail] = useState("")
  const [isPwdInvalid, setIsPwdInvalid] = useState(false)
  const [invalidPasswordText, setInvalidPasswordText] = useState("Please specify a password")
  const [isTypeNotSelected, setIsTypeNotSelected] = useState(false)
  const [isMngrNotSelected, setIsMngrNotSelected] = useState(false)

  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [isMngrRequestLoading, setMngrIsRequestLoading] = useState(true)
  const [notificationSuccessText, setNotificationSuccessText] = useState("")
  const [isNotificationSuccessActive, setIsNotificationSuccessActive] = useState(false)
  const [isNotificationErrorActive, setIsNotificationErrorActive] = useState(false)
  
  const handleNewPwdChange = (event) => {
    newPwd = event.target.value
    if(!newPwd){
      setIsPwdInvalid(true)
      setInvalidPasswordText("Please specify a password")
    }else if(!newPwd.match(/^[-.@_A-Za-z0-9]+$/)){
      setIsPwdInvalid(true)
      setInvalidPasswordText("No special characters, please!")
    }else if(newPwd.length<8 || newPwd.length>21){
      setIsPwdInvalid(true)
      setInvalidPasswordText("Passwords should have a minimum of 8 characters and a maximum of 21 characters")
    }else{
      setIsPwdInvalid(false)
    }
  }

  const handleNewUserTypeChange = (event) => {
    newUserType = event.selectedItem
    
    if(!newUserType){
      setIsTypeNotSelected(true)
    }else{
      setIsTypeNotSelected(false)
    }
  }

  const handleMngrChange = (event) => {
    newMngr = event.selectedItem
    
    if(!newMngr){
      setIsMngrNotSelected(true)
    }else{
      setIsMngrNotSelected(false)
    }
  }

  const location = useLocation()

  const getItemRequest = () => {
    var encodedEmail=location.pathname.split("/users/")[1]
    setIsDataLoading(true)
    const userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    const requestRowData = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      },
    }

    axios
      .get(
        `https://peripheralsloanbackend.mybluemix.net/user/${encodedEmail}`,
        requestRowData
      )
      .then(({ data }) => {
        userData.name = data.employeeName
        userData.email = data.employeeEmail
        userData.serial = data.serial
        userData.area = data.area
        setMngrName(data.mngrName)
        setMngrEmail(data.mngrEmail)
        setUserType(userTypes[data.userType])
        setIsDataLoading(false)
      })
      .catch((e) => {
        window.location.hash = 'not-found'
      })
  }

  const getMngrEmailsAndNamesRequest = () => {
    setMngrIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestRowData = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      },
    }

    axios
      .get(
        'https://peripheralsloanbackend.mybluemix.net/user/',
        requestRowData
      )
      .then(({ data }) => {
        for (var i = 0; i < data.length; i++) {
          mngrs[i] = data[i].employeeName + ", "+ data[i].employeeEmail
        }
        setMngrIsRequestLoading(false)
      }).catch((error)=>{
        setIsNotificationErrorActive(true)
        setMngrIsRequestLoading(false)
      })
  }

  const postDeleteUser = async () => {
    setIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestData = {
      employeeEmail: userData.email,
      mngrEmail: mngrEmail,
      mngrName: mngrName
    }
    var requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      }
    }
    
    axios
      .post(
        'https://peripheralsloanbackend.mybluemix.net/user/deleteUser',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        setDeleteUserPopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationSuccessActive(true)
        setNotificationSuccessText("User deleted successfully")
        window.location.hash = "/users"
      })
      .catch(function (error) {
        setDeleteUserPopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationErrorActive(true)
      })
  }

  const postChangePassword = async () => {
    setIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestData = {
      employeeEmail: userData.email,
      newPwd: newPwd
    }
    var requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      }
    }
    
    axios
      .post(
        'https://peripheralsloanbackend.mybluemix.net/user/changePasswordAdmin',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        setChangePasswordPopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationSuccessActive(true)
        setNotificationSuccessText("Password changed successfully")
      })
      .catch(function (error) {
        setChangePasswordPopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationErrorActive(true)
      })
  }

  const postChangeUserType = async () => {
    setIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestData = {
      employeeEmail: userData.email,
      userType: userTypes.indexOf(newUserType)
    }
    var requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      }
    }
    
    axios
      .post(
        'https://peripheralsloanbackend.mybluemix.net/user/changeUserType',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        setChangeUserTypePopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationSuccessActive(true)
        setNotificationSuccessText("User type changed successfully")
        setUserType(newUserType)
      })
      .catch(function (error) {
        setChangeUserTypePopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationErrorActive(true)
      })
  }

  const postChangeMngr = async () => {
    setIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestData = {
      employeeEmail: userData.email,
      mngrEmail: newMngr.split(", ")[1],
      mngrName: newMngr.split(", ")[0]
    }
    var requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      }
    }
    
    axios
      .post(
        'https://peripheralsloanbackend.mybluemix.net/user/changeManager',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        setChangeMngrPopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationSuccessActive(true)
        setNotificationSuccessText("User's manager changed successfully")
        setMngrEmail(newMngr.split(", ")[1])
        setMngrName(newMngr.split(", ")[0])
      })
      .catch(function (error) {
        setChangeUserTypePopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationErrorActive(true)
      })
  }

  const createCellOfType = (userType) => {
    if (userType=== 'Admin') {
      return(<Tag renderIcon={FaceCool} size="md" className='icon-user'>
        {userType}
      </Tag>)
    } else if (userType === 'Focal' ) {
      return(<Tag renderIcon={User} size="md" className='icon-user'>
        {userType}
      </Tag>)
    } else if (userType === 'Security') {
      return(<Tag renderIcon={Police} size="md" className='icon-user'>
        {userType}
      </Tag>)
    }
  }

  useEffect(() => {
    if (sessionData.userType) {
      redirectIfUserTypeIsNot(sessionData, 'admin')
    }
  }, [sessionData])

  useEffect(() => {
    checkAuth(sessionData, setSessionData, "#/login")
    getMngrEmailsAndNamesRequest()
    getItemRequest()
  }, [])


  return (
    isDataLoading? 
    <Grid className="page-content">
      <Column sm={4} md={8} lg={4} className="actions-block">
        <SkeletonText heading={true}/>
        <SkeletonText heading={true}/>
        <br />
        <ButtonSkeleton />
      </Column>
      <Column sm={4} md={8} lg={12} className="table-block">
        <DataTableSkeleton columnCount={2} rowCount={7} showHeader={false} showToolbar={false} />
      </Column>
    </Grid>
    :
    <>
      <DeleteUserPopUp
        open={deleteUserPopUpOpen}
        setOpen={setDeleteUserPopUpOpen}
        submit={postDeleteUser}
        isDataLoading={isRequestLoading}
      />
      <ChangePasswordPopUp
        open={changePasswordPopUpOpen}
        setOpen={setChangePasswordPopUpOpen}
        submit={postChangePassword}
        handleNewPwdChange={handleNewPwdChange}
        isDataLoading={isRequestLoading}
        isPwdInvalid={isPwdInvalid}
        setIsPwdInvalid={setIsPwdInvalid}
        invalidPasswordText={invalidPasswordText}
      />
      <ChangeUserTypePopUp
        open={changeUserTypePopUpOpen}
        setOpen={setChangeUserTypePopUpOpen}
        submit={postChangeUserType}
        handleNewUserTypeChange={handleNewUserTypeChange}
        isDataLoading={isRequestLoading}
        isTypeNotSelected={isTypeNotSelected}
        setIsTypeNotSelected={setIsTypeNotSelected}
      />
      <ChangeMngrPopUp
        open={changeMngrPopUpOpen}
        setOpen={setChangeMngrPopUpOpen}
        submit={postChangeMngr}
        isDataLoading={isRequestLoading}
        handleMngrChange={handleMngrChange}
        isMngrNotSelected={isMngrNotSelected}
        setIsMngrNotSelected={setIsMngrNotSelected}
      />
      {isNotificationErrorActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="error"
          lowContrast={true}
          title="Error"
          onCloseButtonClick={()=>{setIsNotificationErrorActive(false)}}
          subtitle="Something went wrong, try it later"/>
      </div> : <div></div>}
      {isNotificationSuccessActive ? 
      <div className="error-notification">
        <ToastNotification
          kind="success"
          lowContrast={true}
          title="Success!"
          onCloseButtonClick={()=>{setIsNotificationSuccessActive(false)}}
          subtitle={notificationSuccessText}/>
      </div> : <div></div>}

      <Grid className="page-content">
        <Column sm={4} md={8} lg={4} className="actions-block">
          <h1>{userData.name}</h1>
          <ButtonSet stacked>
            <Button
              renderIcon={UserSettings}
              kind={'secondary'}
              onClick={() => setChangeUserTypePopUpOpen(true)}
            >
              Change User Type
            </Button>
            <Button
              renderIcon={UserIdentification}
              kind={'secondary'}
              onClick={() => setChangeMngrPopUpOpen(true)}
              disabled={isMngrRequestLoading}
            >
              {isMngrRequestLoading ? <InlineLoading description="Loading..." /> : 'Change Manager'}
            </Button>
            <Button
              renderIcon={Password}
              kind={'secondary'}
              onClick={() => setChangePasswordPopUpOpen(true)}
            >
              Change Password
            </Button>
            <Button
              renderIcon={TrashCan}
              kind={'danger'}
              onClick={() => setDeleteUserPopUpOpen(true)}
            >
              Delete
            </Button>
          </ButtonSet>
        </Column>
        <Column sm={4} md={8} lg={12} className="table-block">
          <StructuredListWrapper aria-label="Product details list">
            <StructuredListHead>
              <StructuredListRow head tabIndex={0}>
                <StructuredListCell head>Spec</StructuredListCell>
                <StructuredListCell head><div className='user-details-data'>Value</div></StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Employee Name</StructuredListCell>
                <StructuredListCell><div className='user-details-data'>{userData.name}</div></StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
              <StructuredListCell>Employee Email</StructuredListCell>
                <StructuredListCell><div className='user-details-data'>{userData.email}</div></StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
              <StructuredListCell>Employee Serial</StructuredListCell>
                <StructuredListCell><div className='user-details-data'>{userData.name}</div></StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
              <StructuredListCell>Employee Type</StructuredListCell>
                <StructuredListCell>{
                  createCellOfType(userType)
                }</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Area</StructuredListCell>
                <StructuredListCell><div className='user-details-data'>{userData.area}</div></StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Manager Name</StructuredListCell>
                <StructuredListCell><div className='user-details-data'>{mngrName}</div></StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Manager Email</StructuredListCell>
                <StructuredListCell><div className='user-details-data'>{mngrEmail}</div></StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </Column>
      </Grid>
    </>
  )
}
export default UserDetails