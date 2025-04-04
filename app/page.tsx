import React from 'react';
import Typography from '@mui/material/Typography';

import StyledLink from '@/app/ui/atoms/StyledLink';

const PAGES = [
  {
    displayName: 'yoyos',
    href: '/yoyos',
  },
  {
    displayName: 'color ways',
    href: '/color-ways',
  },
];

export default async function HomePage() {
  return (
    <div className="p-5 w-full">
      <Typography variant="h1" component="h1">G2 Community Yoyo</Typography>
      <p>
        Project to document yoyos by
        {' '}
        <a href="https://www.gsquaredyoyos.com/">g2</a>
        .
      </p>
      <Typography variant="h2" component="h2">Pages:</Typography>
      <ul className="flex flex-row align-center justify-around list-none">
        {
          PAGES.map(({ displayName, href }) => (
            <li key={displayName}>
              <StyledLink href={href} className="p-2">{displayName}</StyledLink>
            </li>
          ))
        }
      </ul>
    </div>
  );
}
