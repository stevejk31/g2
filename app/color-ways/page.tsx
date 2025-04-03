import React from 'react';
import fsPromises from 'fs/promises';
import path from 'path';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

export default async function ColorWaysPage() {
  const colorWays = await fsPromises.readFile(path.join(process.cwd(), 'backup/color-ways.json'), { encoding: 'utf8' });
  const colorWaysJson = JSON.parse(colorWays);
  return (
    <div className="w-full p-5">
      <Typography variant="h1" component="h1">Color ways</Typography>
      <ul className="flex items-stretch justify-around flex-wrap gap-7 list-none">
        {Object.entries(colorWaysJson).map(([name, src]) => (
          <li key={name}>
            {name}
            <Image alt={name} src={src as string} width="200" height="200" />
          </li>
        ))}
      </ul>
    </div>
  );
}
