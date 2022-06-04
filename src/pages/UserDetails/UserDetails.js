import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSessionData } from '../../global-context'
import { checkAuth, redirectIfUserTypeIsNot } from '../../util'
import { TrashCan, FaceCool, User, Police, Password } from '@carbon/icons-react'
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
  DataTableSkeleton
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

const ChangePasswordPopUp = ({ open, setOpen, submit, isDataLoading, handleNewPwdChange, isPwdInvalid, invalidPasswordText }) => (
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
    onRequestSubmit={submit}
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

var userData = {
  name: "",
  email: "",
  serial: "",
  userType: "",
  mngrName: "",
  mngrEmail: "",
  area: ""
}

const userTypes = ['Admin','Focal','Security']
var newPwd

const UserDetails = () => {
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { sessionData, setSessionData } = useSessionData()
  const [deleteUserPopUpOpen, setDeleteUserPopUpOpen] = useState(false)
  const [changePasswordPopUpOpen, setChangePasswordPopUpOpen] = useState(false)
  const [changeUserTypePopUpOpen, setChangeUserTypePopUpOpen] = useState(false)
  const [changeManagerPopUpOpen, setChangeManagerPopUpOpen] = useState(false)
  const [isPwdInvalid, setIsPwdInvalid] = useState(false)
  const [invalidPasswordText, setInvalidPasswordText] = useState(false)

  const [isRequestLoading, setIsRequestLoading] = useState(false)
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
        `http://localhost:3001/user/${encodedEmail}`,
        requestRowData
      )
      .then(({ data }) => {
        console.log(data)
        userData.name = data.employeeName
        userData.email = data.employeeEmail
        userData.serial = data.serial
        userData.area = data.area
        userData.mngrName = data.mngrName
        userData.mngrEmail = data.mngrEmail
        userData.userType = userTypes[data.userType]
        setIsDataLoading(false)
      })
      .catch((e) => {
        window.location.hash = 'not-found'
      })
  }

  const postDeleteUser = async () => {
    setIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestData = {
      employeeEmail: userData.email,
      mngrEmail: userData.mngrEmail,
      mngrName: userData.mngrName
    }
    var requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      }
    }
    
    axios
      .post(
        'http://localhost:3001/user/deleteUser',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        console.log(data.message)
        setDeleteUserPopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationSuccessActive(true)
        setNotificationSuccessText("User deleted successfully")
        window.location.hash = "/users"
      })
      .catch(function (error) {
        console.log("error")
        setDeleteUserPopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationErrorActive(true)
      })
  }

  const postChangePassword = async () => {
    setIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    console.log(newPwd)
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
        'http://localhost:3001/user/changePasswordAdmin',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        console.log(data.message)
        setChangePasswordPopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationSuccessActive(true)
        setNotificationSuccessText("Password changed successfully")
      })
      .catch(function (error) {
        console.log("error")
        console.log(error)
        setChangePasswordPopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationErrorActive(true)
      })
  }

  const postChangeUserType = async () => {
    setIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    console.log(newPwd)
    var requestData = {
      employeeEmail: userData.email,
      userType: userType
    }
    var requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      }
    }
    
    axios
      .post(
        'http://localhost:3001/user/changeUserType',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        console.log(data.message)
        setChangeUserTypePopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationSuccessActive(true)
        setNotificationSuccessText("User type changed successfully")
        
      })
      .catch(function (error) {
        console.log("error")
        console.log(error)
        setChangeUserTypePopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationErrorActive(true)
      })
  }

  const createCellOfType = (userType) => {
    if (userData.userType=== 'Admin') {
      return(<Tag renderIcon={FaceCool} size="md" className='icon-user'>
        {userData.userType}
      </Tag>)
    } else if (userData.userType === 'Focal' ) {
      return(<Tag renderIcon={User} size="md" className='icon-user'>
        {userData.userType}
      </Tag>)
    } else if (userData.userType === 'Security') {
      return(<Tag renderIcon={Police} size="md" className='icon-user'>
        {userData.userType}
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
        invalidPasswordText={invalidPasswordText}
      />
      {/* <ChangeUserTypePopUp
        open={changeUserTypePopUpOpen}
        setOpen={setChangeUserTypePopUpOpen}
        submit={postChangeUserType}
        isDataLoading={isRequestLoading}
      />
      <ChangeManagerPopUp
        open={changeManagerPopUpOpen}
        setOpen={setChangeManagerPopUpOpen}
        submit={postChangeManager}
        isDataLoading={isRequestLoading}
      /> */}
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
                  createCellOfType(userData.userType)
                }</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Area</StructuredListCell>
                <StructuredListCell><div className='user-details-data'>{userData.area}</div></StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Manager Name</StructuredListCell>
                <StructuredListCell><div className='user-details-data'>{userData.mngrName}</div></StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Manager Email</StructuredListCell>
                <StructuredListCell><div className='user-details-data'>{userData.mngrEmail}</div></StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </Column>
      </Grid>
    </>
  )
}
export default UserDetails