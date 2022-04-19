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

import { Apps, Notification, User } from '@carbon/icons-react'

const TutorialHeader = () => (
  <HeaderContainer
    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
      <Header aria-label="Periferal Loans">
        <SkipToContent />
        <HeaderMenuButton
          aria-label="Open menu"
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />
        <HeaderName href="/" prefix="IBM">
          Periferal Loans
        </HeaderName>
        <HeaderNavigation aria-label="Periferal Loans">
          <HeaderMenuItem element={Link} to="/login">
            Login
          </HeaderMenuItem>
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
          <HeaderGlobalAction aria-label="Apps">
            <Apps size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
    )}
  />
)

export default TutorialHeader
