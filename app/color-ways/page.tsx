import React, { Suspense } from 'react';
import Typography from '@mui/material/Typography';
import Loading from '@/app/ui/atoms/Loading';

import ColorWays from '@/app/ui/organisms/ColorWays';
import ColorWayFilter from '@/app/ui/organisms/ColorWayFilter';
import FilterContent from '@/app/ui/templates/FilterContent';

interface ColorWayPageProps {
  searchParams: Promise<{[ key: string ]: string | string[] | undefined }>
}

export default async function ColorWaysPage({ searchParams }: ColorWayPageProps) {
  const payload = await searchParams || {};
  const name = (!!payload.name && typeof payload.name === 'string') ? payload.name : '';
  let unverified;

  if (payload.unverified !== undefined) {
    if (payload.unverified === 'true') {
      unverified = true;
    }
    if (payload.unverified === 'false') {
      unverified = false;
    }
  }

  return (
    <div className="w-full p-5">
      <Typography variant="h1" component="h1">color ways</Typography>
      <FilterContent
        sortBy={(
          <>
            hello
          </>
        )}
        filter={(
          <Suspense fallback={<Loading className="w-full" />}>
            <ColorWayFilter />
          </Suspense>
        )}
      >
        <Suspense fallback={<Loading className="w-full" />}>
          <ColorWays
            filterOptions={{
              name,
              unverified,
            }}
          />
        </Suspense>
      </FilterContent>
    </div>
  );
}
