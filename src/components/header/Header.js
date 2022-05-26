import React, { useState } from 'react'
import { Link } from 'react-router-dom'

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
} from 'carbon-components-react'

import { Notification, User, Logout } from '@carbon/icons-react'
import { useSessionData } from '../../global-context'

const AccountInfo = () => {
  const { sessionData } = useSessionData()
  return (
    <div className="account-data-area">
      <h1>Account</h1>
      <p>{sessionData.email}</p>
      <p>Profile: {sessionData.userType}</p>
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

  const { sessionData, setSessionData } = useSessionData()

  const LogOut = () => {
    localStorage.removeItem('UserInfo')
    window.location.hash = '/login'
    setSessionData({ ...sessionData, loggedIn: false })
  }

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Periferal Loans" className="app-header">
          <HeaderName href="/" prefix="IBM">
            Peripheral Loans
          </HeaderName>

          {sessionData.loggedIn && (
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
              </HeaderNavigation>
              <SideNav
                aria-label="Side navigation"
                expanded={isSideNavExpanded}
                isPersistent={false}
              >
                <SideNavItems>
                  <HeaderSideNavItems>
                    <HeaderMenuItem element={Link} to="/devices">
                      Devices
                    </HeaderMenuItem>
                  </HeaderSideNavItems>
                </SideNavItems>
              </SideNav>
              <HeaderGlobalBar>
                <HeaderGlobalAction aria-label="Notifications">
                  <Notification size={20} />
                </HeaderGlobalAction>
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
                <AccountInfo />
                <TempUserTypeSwitch setUserMenuOn={setUserMenuOn} />
              </HeaderPanel>
            </>
          )}
        </Header>
      )}
    />
  )
}
export default TutorialHeader
