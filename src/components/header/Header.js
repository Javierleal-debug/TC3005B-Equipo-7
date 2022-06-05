import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
  RadioButtonGroup,
  RadioButton,
  HeaderPanel,
  Tag,
  Button,
  Modal,
  InlineLoading,
  TextInput,
  ToastNotification

} from 'carbon-components-react'

import { User, Logout, Police, FaceCool, Password } from '@carbon/icons-react'
import { useSessionData } from '../../global-context'

var oldPwd, newPwd, confirmPwd

const ChangePasswordPopUp = ({ open, setOpen, submit, isDataLoading, isOldPwdInvalid, setIsOldPwdInvalid, invalidOldPwdText, setInvalidOldPwdText }) => {
  const [isNewPwdInvalid, setIsNewPwdInvalid] = useState(false)
  const [invalidNewPwdText, setInvalidNewPwdText] = useState("Please specify a password")
  const [isConfirmPwdInvalid, setIsConfirmPwdInvalid] = useState(false)
  const [invalidConfirmPwdText, setInvalidConfirmPwdText] = useState("Please specify a password")
  
  return(
  <Modal
    open={open}
    modalLabel="User Profile"
    modalHeading="Change Password"
    primaryButtonDisabled={isDataLoading || isOldPwdInvalid || isNewPwdInvalid || isConfirmPwdInvalid}
    primaryButtonText={
      isDataLoading ? <InlineLoading description="Loading..." /> : 'Change Password'
    }
    secondaryButtonText="Cancel"
    onSecondarySubmit={() => setOpen(false)}
    onRequestClose={() => setOpen(false)}
    onRequestSubmit={()=>{
      let allowRequest = true
      if(!oldPwd){
        setIsOldPwdInvalid(true)
        allowRequest = false
      }
      if(!newPwd){
        setIsNewPwdInvalid(true)
        allowRequest = false
      }
      if(!confirmPwd){
        setIsConfirmPwdInvalid(true)
        allowRequest = false
      }
      if(newPwd!==confirmPwd){
        setIsConfirmPwdInvalid(true)
        setInvalidConfirmPwdText("Passwords do not match")
        allowRequest = false
      }
      if(allowRequest){
        submit()
      }
    }}
  >
    <p>
      By clicking "Change Password", you understand that your password will be changed.
    </p>
    <div className="change-my-password-input-field">
    <TextInput.PasswordInput
      type="password"
      id="oldPassword"
      placeholder=""
      labelText="Old password"
      onChange={(event)=>{
        oldPwd = event.target.value
        if(!oldPwd){
          setIsOldPwdInvalid(true)
          setInvalidOldPwdText("Please specify a password")
        }else if(!oldPwd.match(/^[-.@_A-Za-z0-9]+$/)){
          setIsOldPwdInvalid(true)
          setInvalidOldPwdText("No special characters, please!")
        }else if(oldPwd.length<8 || oldPwd.length>21){
          setIsOldPwdInvalid(true)
          setInvalidOldPwdText("Passwords should have a minimum of 8 characters and a maximum of 21 characters")
        }else{
          setIsOldPwdInvalid(false)
        }
      }}
      invalid={isOldPwdInvalid}
      invalidText={invalidOldPwdText}
    />
    </div>
    <div className="change-my-password-input-field">
      <TextInput.PasswordInput
        type="password"
        id="newPassword"
        placeholder=""
        labelText="New password"
        onChange={(event)=>{
          newPwd = event.target.value
          if(!newPwd){
            setIsNewPwdInvalid(true)
            setInvalidNewPwdText("Please specify a password")
          }else if(!newPwd.match(/^[-.@_A-Za-z0-9]+$/)){
            setIsNewPwdInvalid(true)
            setInvalidNewPwdText("No special characters, please!")
          }else if(newPwd.length<8 || newPwd.length>21){
            setIsNewPwdInvalid(true)
            setInvalidNewPwdText("Passwords should have a minimum of 8 characters and a maximum of 21 characters")
          }else{
            setIsNewPwdInvalid(false)
          }
        }}
        invalid={isNewPwdInvalid}
        invalidText={invalidNewPwdText}
      />
    </div>
    <div className="change-my-password-input-field">
      <TextInput.PasswordInput
        type="password"
        id="repeatedNewPassword"
        placeholder=""
        labelText="Confirm new password"
        onChange={(event)=>{
          confirmPwd = event.target.value
          if(!confirmPwd){
            setIsConfirmPwdInvalid(true)
            setInvalidConfirmPwdText("Please specify a password")
          }else if(!confirmPwd.match(/^[-.@_A-Za-z0-9]+$/)){
            setIsConfirmPwdInvalid(true)
            setInvalidConfirmPwdText("No special characters, please!")
          }else if(confirmPwd.length<8 || confirmPwd.length>21){
            setIsConfirmPwdInvalid(true)
            setInvalidConfirmPwdText("Passwords should have a minimum of 8 characters and a maximum of 21 characters")
          }else{
            setIsConfirmPwdInvalid(false)
          }
        }}
        invalid={isConfirmPwdInvalid}
        invalidText={invalidConfirmPwdText}
      />
    </div>
  </Modal>)
}

const AccountInfo = ({ userData }) => {
  const { sessionData } = useSessionData()
  
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [changePasswordPopUpOpen, setChangePasswordPopUpOpen] = useState(false)
  const [isOldPwdInvalid, setIsOldPwdInvalid] = useState(false)
  const [invalidOldPwdText, setInvalidOldPwdText] = useState("Please specify a password")
  
  const [isNotificationSuccessActive, setIsNotificationSuccessActive] = useState(false)
  const [isNotificationErrorActive, setIsNotificationErrorActive] = useState(false)

  const postChangePassword = async () => {
    setIsRequestLoading(true)
    var userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    var requestData = {
      employeeEmail: userData.email,
      newPwd: confirmPwd,
      pwd: oldPwd
    }
    var requestHeaders = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      }
    }
    
    axios
      .post(
        'https://peripheralsloanbackend.mybluemix.net/user/changePassword',
        requestData,
        requestHeaders
      )
      .then(({ data }) => {
        if(data.message === "Invalid Password Contact an Admin for help"){
          setIsRequestLoading(false)
          setIsOldPwdInvalid(true)
          setInvalidOldPwdText("Incorrect password...")
        }else{
          console.log(data.message)
          setChangePasswordPopUpOpen(false)
          setIsRequestLoading(false)
          setIsNotificationSuccessActive(true)
        }
      })
      .catch(({error}) => {
        setChangePasswordPopUpOpen(false)
        setIsRequestLoading(false)
        setIsNotificationErrorActive(true)
      })
  }

  const createUserType = (userType) => {
    userType = userType.charAt(0).toUpperCase() + userType.slice(1)
    if (userType === 'Admin') {
      return (
        <Tag renderIcon={FaceCool} size="md" className='icon-user'>
          {userType}
        </Tag>
      )
    } else if (userType === 'Focal' ) {
      return (
        <Tag renderIcon={User} size="md" className='icon-user'>
          {userType}
        </Tag>
      )
    } else if (userType === 'Security') {
      return (
        <Tag renderIcon={Police} size="md" className='icon-user'>
          {userType}
        </Tag>
      )
    }
  }

  return (
    <div className="account-data-area">
      <ChangePasswordPopUp
        open={changePasswordPopUpOpen}
        setOpen={setChangePasswordPopUpOpen}
        submit={postChangePassword}

        isOldPwdInvalid={isOldPwdInvalid}
        setIsOldPwdInvalid={setIsOldPwdInvalid}

        invalidOldPwdText={invalidOldPwdText}
        setInvalidOldPwdText={setInvalidOldPwdText}

        isDataLoading={isRequestLoading}
      />
      <h3 className='account-user-data'>{userData.name}</h3>
      <p className='account-user-data'>{userData.email}</p>
      {createUserType(sessionData.userType)}
      <Button
        renderIcon={Password}
        kind={'secondary'}
        className="openPopUp-changepwd-button"
        onClick={() => setChangePasswordPopUpOpen(true)}
      >
        Change Password
      </Button>
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
          subtitle={"Password changed successfully"}/>
      </div> : <div></div>}
    </div>
  )
}

const TempUserTypeSwitch = ({ setUserMenuOn }) => {
  const { sessionData, setSessionData } = useSessionData()

  const handleChange = (e) => {
    setSessionData({ ...sessionData, userType: e.target.value })
    setUserMenuOn(false)
  }

  return (
    <RadioButtonGroup
      legendText="Switch user type"
      name="radio-button-group"
      defaultSelected={sessionData.userType}
    >
      <RadioButton
        labelText="Focal"
        value="focal"
        id="focal"
        onClick={handleChange}
      />
      <RadioButton
        labelText="Requisitor"
        value="requisitor"
        id="requisitor"
        onClick={handleChange}
      />
      <RadioButton
        labelText="Security"
        value="security"
        id="security"
        onClick={handleChange}
      />
    </RadioButtonGroup>
  )
}

const TutorialHeader = () => {
  const [userMenuOn, setUserMenuOn] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    email: ""
  })

  const { sessionData, setSessionData } = useSessionData()

  const getUserInfoRequest = () => {
    const userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    const requestRowData = {
      headers: {
        'x-access-token': `${userInfo['accessToken']}`,
      },
    }

    axios
      .get(
        `https://peripheralsloanbackend.mybluemix.net/user/${encodeURIComponent(userInfo.email)}`,
        requestRowData
      )
      .then(({ data }) => {
        setUserData({ email: data.employeeEmail, name: data.employeeName })
      })
      .catch((e) => {
        window.location.hash = 'not-found'
      })
  }

  useEffect(() => {
    if (!sessionData.loggedIn){ window.location.hash = '/login'}
  }, [sessionData])

  // useEffect(() => {
  //   getUserInfoRequest()
  // }, [])

  const LogOut = () => {
    localStorage.removeItem('UserInfo')
    setSessionData({
      userType: '',
      accessToken: '',
      loggedIn: false,
      email: '',
      name: '',
    })
  }

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Periferal Loans" className="app-header">
          <HeaderName href="/" prefix="IBM">
            Peripheral Loans
          </HeaderName>

          {sessionData.loggedIn && localStorage.getItem('UserInfo') && getUserInfoRequest && (
            <>
              <SkipToContent />
              <HeaderMenuButton
                aria-label="Open menu"
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
              />
              <HeaderNavigation aria-label="Peripheral Loans">
                <HeaderMenuItem element={Link} to="/dashboard">
                  Dashboard
                </HeaderMenuItem>
                <HeaderMenuItem element={Link} to="/devices">
                  Devices
                </HeaderMenuItem>
                {!(sessionData.userType === 'security') && (
                  <HeaderMenuItem element={Link} to="/my-inventory">
                    My Inventory
                  </HeaderMenuItem>
                )}
                {(sessionData.userType === 'admin') && (
                  <HeaderMenuItem element={Link} to="/users">
                    Manage Users
                  </HeaderMenuItem>
                )}
              </HeaderNavigation>
              <SideNav
                aria-label="Side navigation"
                expanded={isSideNavExpanded}
                isPersistent={false}
              >
                <SideNavItems>
                  <HeaderSideNavItems>
                    <HeaderMenuItem element={Link} to="/dashboard">
                      Dashboard
                    </HeaderMenuItem>
                    <HeaderMenuItem element={Link} to="/devices">
                      Devices
                    </HeaderMenuItem>
                    {!(sessionData.userType === 'security') && (
                      <HeaderMenuItem element={Link} to="/my-inventory">
                        My Inventory
                      </HeaderMenuItem>
                    )}
                    {(sessionData.userType === 'admin') && (
                      <HeaderMenuItem element={Link} to="/users">
                        Manage Users
                      </HeaderMenuItem>
                    )}
                  </HeaderSideNavItems>
                </SideNavItems>
              </SideNav>
              <HeaderGlobalBar>
                <HeaderGlobalAction
                  aria-label="Account"
                  onClick={() => {
                    setUserMenuOn(!userMenuOn)
                  }}
                  isActive={userMenuOn}
                >
                  <User size={20} />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Logout" onClick={LogOut}>
                  <Logout size={20} />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
              <HeaderPanel aria-label="Header Panel" expanded={userMenuOn}>
                <AccountInfo 
                  userData={userData}
                />
                {/*<TempUserTypeSwitch setUserMenuOn={setUserMenuOn} />*/}
              </HeaderPanel>
            </>
          )}
        </Header>
      )}
    />
  )
}
export default TutorialHeader
