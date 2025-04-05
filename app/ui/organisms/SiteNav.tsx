import React, { Fragment } from 'react';

import StyledLink from '@/app/ui/atoms/StyledLink';

const PAGES = [
  {
    displayName: 'home',
    href: '/',
  },
  {
    displayName: 'yoyos',
    href: '/yoyos',
  },
  {
    displayName: 'color ways',
    href: '/color-ways',
  },
];
export default function SiteNav() {
  return (
    <ul className="flex flex-row align-center justify-around list-none border-b">
      {
        PAGES.map(({ displayName, href }, idx) => (
          <Fragment key={displayName}>
            <li className="p-5">
              <StyledLink href={href}>{displayName}</StyledLink>
            </li>
            {
              (idx + 1) < PAGES.length && (
                <li className="py-5">|</li>
              )
            }
          </Fragment>
        ))
        }
    </ul>
  );
}
