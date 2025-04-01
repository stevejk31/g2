import React from 'react';
import clsx from 'clsx';

import SliderQueryParam from '@/app/ui/atoms/SliderQueryParam';
import ResetFilters from '@/app/ui/molecules/ResetFilters';

import { fetchMaxAndMinValues } from '@/app/lib/db/yoyoList';

export default async function YoyoFilter({ className = '' }: { className?: string}) {
  const minMaxValues = await fetchMaxAndMinValues();
  return (
    <ul className={clsx('flex justify-start flex-wrap gap-5', className)}>
      { minMaxValues.map(({ name, min, max }) => (
        <li
          key={name}
          // Prevent collapse of range and account for bubble overflow.
          className="min-w-100 p-3"
        >
          <SliderQueryParam label={name} min={min} max={max} />
        </li>
      ))}
      <li>
        <ResetFilters />
      </li>
    </ul>
  );
}
