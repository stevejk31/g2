import React, { Suspense } from 'react';
import Typography from '@mui/material/Typography';

import Loading from '@/app/ui/atoms/Loading';
import Yoyos from '@/app/ui/organisms/Yoyos';
import YoyoFilter from '@/app/ui/organisms/YoyoFilter';
import FilterContent from '@/app/ui/templates/FilterContent';

interface YoyosPageProps {
  searchParams: Promise<{[ key: string ]: string | string[] | undefined }>
}

export default async function YoyosPage({ searchParams }: YoyosPageProps) {
  const payload = await searchParams || {};
  return (
    <div className="p-5 w-full">
      <Typography variant="h1" component="h1">Yoyos</Typography>
      <FilterContent
        sortBy={(
          <>
            hello
          </>
        )}
        filter={(
          <Suspense
            fallback={<Loading className="w-full" />}
          >
            <YoyoFilter className="flex-row xl:flex-col" />
          </Suspense>
        )}
      >
        <Suspense
          fallback={<Loading className="w-full" />}
        >
          <Yoyos
            diameterMin={payload['diameter-min']}
            diameterMax={payload['diameter-max']}
            widthMin={payload['width-min']}
            widthMax={payload['width-max']}
            weightMin={payload['weight-min']}
            weightMax={payload['weight-max']}
          />
        </Suspense>
      </FilterContent>
    </div>
  );
}
