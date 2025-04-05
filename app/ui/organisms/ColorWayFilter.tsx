import React from 'react';
import clsx from 'clsx';
import ResetFilters from '@/app/ui/molecules/ResetFilters';
import NameFilterQueryParam from '@/app/ui/molecules/NameFilterQueryParam';

export default async function ColorWayFilter({ className = '' }: { className?: string}) {
  return (
    <ul
      className={clsx(
        'flex flex-row justify-start items-start flex-wrap gap-5 xl:items-stretch xl:gap-1 xl:flex-col',
        className,
      )}
    >
      <li>
        <NameFilterQueryParam />
      </li>
      <li>
        <ResetFilters />
      </li>
    </ul>
  );
}
