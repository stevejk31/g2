import React, { ReactNode } from 'react';

interface FilterContentProps {
  sortBy: ReactNode;
  filter: ReactNode;
  children: ReactNode;
}

/**
 * Layout with filter and content.
 *
 * < xl
 * *********************
 * * ***************** *
 * * *        SORT BY* *
 * * ***************** *
 * * ***************** *
 * * *    FILTERS    * *
 * * ***************** *
 * *                   *
 * * ***************** *
 * * *    CONTENT    * *
 * * ***************** *
 * *********************
 *
 * > xl
 * **************************
 * * ********************** *
 * * *             SORT BY* *
 * * ********************** *
 * * *********  *********** *
 * * *FILTERS*  * CONTENT * *
 * * *********  *********** *
 * **************************
 *
 */
export default function FilterContent({ sortBy, filter, children }: FilterContentProps) {
  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-3">
      <div className="flex flex-row align-center justify-end xl:col-span-3">
        {sortBy}
      </div>
      <div className="xl:col-span-1">
        {filter}
      </div>
      <div className="xl:col-span-2">
        {children}
      </div>
    </div>
  );
}
