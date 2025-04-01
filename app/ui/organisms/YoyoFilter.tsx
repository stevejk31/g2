import React from 'react';
import clsx from 'clsx';

import SliderQueryParam from '@/app/ui/atoms/SliderQueryParam';

import { fetchMaxAndMinValues } from '@/app/lib/db/yoyoList';

export default async function YoyoFilter({ className = '' }: { className?: string}) {
  const minMaxValues = await fetchMaxAndMinValues();
  return (
    <ul className={clsx('flex space-between flex-wrap gap-5', className)}>
      { minMaxValues.map(({ name, min, max }) => (
        <li key={name}>
          <SliderQueryParam label={name} min={min} max={max} />
        </li>
      ))}
    </ul>
  );
}
