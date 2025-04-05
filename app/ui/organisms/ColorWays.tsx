import React from 'react';
import Image from 'next/image';

import { fetchColorWays } from '@/app/lib/db/colorWays';
import type { ColorWayRow } from '@/app/lib/db/colorWays';

interface ColorWaysProps {
  filterOptions?: Partial<ColorWayRow>
}

export default async function ColorWays({ filterOptions = {} }: ColorWaysProps) {
  const colorWays = await fetchColorWays(filterOptions);
  return (
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
  );
}
