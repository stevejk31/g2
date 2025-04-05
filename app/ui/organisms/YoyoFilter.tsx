import React from 'react';
import clsx from 'clsx';

import MinMaxSliderQueryParam from '@/app/ui/molecules/MinMaxSliderQueryParam';
import NameFilterQueryParam from '@/app/ui/molecules/NameFilterQueryParam';
import ResetFilters from '@/app/ui/molecules/ResetFilters';

import { fetchMaxAndMinValues } from '@/app/lib/db/yoyoList';

const LI_PADDING = 'py-3';
const LI_CLASS_NAME = `xl:border-b ${LI_PADDING}`;

export default async function YoyoFilter({ className = '' }: { className?: string}) {
  const minMaxValues = await fetchMaxAndMinValues();
  return (
    <ul className={clsx('flex justify-start items-start flex-wrap gap-5 xl:items-stretch xl:gap-1', className)}>
      <li className={LI_CLASS_NAME}>
        <NameFilterQueryParam />
      </li>
      { minMaxValues.map(({ name, min, max }) => (
        <li key={name} className={LI_CLASS_NAME}>
          <MinMaxSliderQueryParam label={name} min={min} max={max} />
        </li>
      ))}
      <li className={LI_PADDING}>
        <ResetFilters />
      </li>
    </ul>
  );
}
