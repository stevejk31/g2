import React from 'react';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

import { fetchColorWays } from '@/app/lib/db/colorWays';

export default async function ColorWaysPage() {
  const colorWays = await fetchColorWays({ unverified: false });
  return (
    <div className="w-full p-5">
      <Typography variant="h1" component="h1">Color ways</Typography>
      <ul className="flex items-stretch justify-around flex-wrap gap-7 list-none">
        {colorWays.map(({ name, src }) => (
          <li key={name}>
            {name}
            {
              src.includes('http') ? (
                <img alt={name} src={src as string} width="200" height="200" />
              ) : (
                <Image alt={name} src={src as string} width="200" height="200" />
              )
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
