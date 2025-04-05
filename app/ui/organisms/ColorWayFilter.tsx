import React from 'react';
import clsx from 'clsx';
import ResetFilters from '@/app/ui/molecules/ResetFilters';
import NameFilterQueryParam from '@/app/ui/molecules/NameFilterQueryParam';

export default async function ColorWayFilter({ className = '' }: { className?: string}) {
  return (
    <ul className={clsx('flex justify-start flex-wrap gap-5', className)}>
      <li>
        <NameFilterQueryParam />
      </li>
      <li>
        <ResetFilters />
      </li>
    </ul>
  );
}
