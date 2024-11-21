import React, { Fragment, memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Classes,
  Icon,
  Navbar,
  NavbarDivider,
  NavbarGroup,
} from '@blueprintjs/core';

import classes from './Header.module.css';

export const Header = memo(() => {
  const location = useLocation();

  const headerData: {
    path: string;
    isActive: boolean;
    iconName: any;
    title: string;
  }[] = useMemo(
    () => [
      {
        path: '/',
        isActive: location.pathname === '/',
        iconName: 'calculator',
        title: 'Calculator',
      },
      {
        path: '/home',
        isActive: location.pathname === '/home',
        iconName: 'home',
        title: 'Home',
      },
      {
        path: '/campaigns',
        isActive: location.pathname === '/campaigns',
        iconName: 'automatic-updates',
        title: 'My campaigns',
      },
      {
        path: '/emailgroups',
        isActive: location.pathname === '/emailgroups',
        iconName: 'people',
        title: 'My email groups',
      },
      {
        path: '/assets',
        isActive: location.pathname === '/assets',
        iconName: 'shapes',
        title: 'My assets',
      },
    ],
    [location]
  );

  return (
    <Navbar className={classes.navbar}>
      <div className={classes.container}>
        <NavbarGroup className={classes.navbarGroup}>
          {headerData.map((headerElement, index) => (
            <Fragment key={index}>
              <Link
                key={headerElement.title}
                to={headerElement.path}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className={`${Classes.BUTTON} ${Classes.MINIMAL} ${
                    Classes.LARGE
                  } ${headerElement.isActive ? Classes.INTENT_PRIMARY : ''}`}
                >
                  <Icon icon={headerElement.iconName} />
                  <div> {headerElement.title} </div>
                </div>
              </Link>
              {index === 0 && <NavbarDivider />}
            </Fragment>
          ))}
        </NavbarGroup>
      </div>
    </Navbar>
  );
});
