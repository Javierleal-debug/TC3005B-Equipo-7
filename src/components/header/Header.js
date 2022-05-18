import React from 'react'
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
} from 'carbon-components-react'

import { Apps, Notification, User , Logout} from '@carbon/icons-react'

function LogOut(){
    localStorage.removeItem('UserInfo');
    window.location.hash = '/login';
}

const TutorialHeader = () => (
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
          <HeaderGlobalAction aria-label="Account">
            <User size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="Logout" onClick={LogOut}>
            <Logout size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
    )}
  />
)

export default TutorialHeader
