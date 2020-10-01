import * as React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

/**
 * Returns true if the given href is a URL
 * Used to determine if an href leaves the app or not
 */
const isUrl = (href:string): boolean => {
  // There are more precise ways to go about this
  // But this is fine for non-user-provided values
  return (/^https?:\/\//i).test(href)
}

export interface AppNavItem {
  label: string;
  href: string;
}

export const AppNav: React.FunctionComponent<{items:ReadonlyArray<AppNavItem>}> = ({items}) => (
  <Navbar light color="light" expand="md">
    <NavbarBrand tag={Link} to="/">Jailbot</NavbarBrand>
    <Nav navbar>
      {items.map((n,i) => {
        const externalLink = isUrl(n.href);
        const linkProps = {
          tag: externalLink ? undefined : Link,
          [externalLink ? 'href' : 'to']: n.href
        }
        return (
          <NavItem key={i}>
            <NavLink {...linkProps}>{n.label}</NavLink>
          </NavItem>
        )
      })}
    </Nav>
  </Navbar>
)

export default AppNav;
