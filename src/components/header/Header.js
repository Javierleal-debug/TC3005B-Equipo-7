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
  OverflowMenu,
  HeaderPanel,
} from 'carbon-components-react'

import { Apps, Notification, User, Logout } from '@carbon/icons-react'
import { useUserType } from '../../global-context'

function LogOut() {
  localStorage.removeItem('UserInfo')
  window.location.hash = '/login'
}

const TempUserTypeSwitch = ({ setUserMenuOn }) => {
  const { userType, setUserType } = useUserType()

  const handleChange = (e) => {
    setUserType(e.target.value)
    setUserMenuOn(false)
  }

  return (
    <>
      <h1 style={{ padding: '20px' }}>User type</h1>
      <RadioButtonGroup
        legendText="Switch user type"
        name="radio-button-group"
        defaultSelected={userType}
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
    </>
  )
}

const TutorialHeader = () => {
  const [userMenuOn, setUserMenuOn] = useState(false)

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Periferal Loans" className="app-header">
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="/" prefix="IBM">
            Peripheral Loans
          </HeaderName>
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
            <TempUserTypeSwitch setUserMenuOn={setUserMenuOn} />
          </HeaderPanel>
        </Header>
      )}
    />
  )
}
export default TutorialHeader
