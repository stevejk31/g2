import React from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';

import { fetchYoyoList } from '@/app/lib/db/yoyoList';

export default async function YoyoList({ className = '' }: { className?: string}) {
  const yoyoList = await fetchYoyoList();
  return (
    <ul className={clsx('flex space-between flex-wrap gap-5', className)}>
      { yoyoList.map(({ name, weight, img_src }) => (
        <li key={name}>
          <Typography component="h1">
            {name}
          </Typography>
          {weight}

          {
              img_src && <img src={img_src} alt={name} width={200} />
            }
        </li>
      ))}
    </ul>
  );
}
