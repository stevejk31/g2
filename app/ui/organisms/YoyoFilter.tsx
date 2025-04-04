import React from 'react';
import clsx from 'clsx';

import MinMaxSliderQueryParam from '@/app/ui/molecules/MinMaxSliderQueryParam';
import ResetFilters from '@/app/ui/molecules/ResetFilters';

import { fetchMaxAndMinValues } from '@/app/lib/db/yoyoList';

export default async function YoyoFilter({ className = '' }: { className?: string}) {
  const minMaxValues = await fetchMaxAndMinValues();
  return (
    <ul className={clsx('flex justify-start flex-wrap gap-5', className)}>
      { minMaxValues.map(({ name, min, max }) => (
        <li key={name} className="border-b py-2">
          <MinMaxSliderQueryParam label={name} min={min} max={max} />
        </li>
      ))}
      <li>
        <ResetFilters />
      </li>
    </ul>
  );
}
