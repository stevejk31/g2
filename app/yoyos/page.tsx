import React, { Suspense } from 'react';
import Typography from '@mui/material/Typography';

import Loading from '@/app/ui/atoms/Loading';
import Yoyos from '@/app/ui/organisms/Yoyos';
import YoyoFilter from '@/app/ui/organisms/YoyoFilter';

interface YoyosPageProps {
  searchParams: Promise<{[ key: string ]: string | string[] | undefined }>
}

export default async function YoyosPage({ searchParams }: YoyosPageProps) {
  const payload = await searchParams || {};
  return (
    <div className="p-5 w-full">
      <Typography variant="h1" component="h1">Yoyos</Typography>
      <div className="flex flex-col xl:flex-row gap-10">
        <Suspense
          fallback={<Loading className="xl:w-1/3" />}
        >
          <YoyoFilter className="xl:w-1/3 flex-row xl:flex-col" />
        </Suspense>
        <Suspense
          fallback={<Loading className="xl:w-2/3" />}
        >
          <Yoyos
            className="xl:w-2/3"
            diameterMin={payload['diameter-min']}
            diameterMax={payload['diameter-max']}
            widthMin={payload['width-min']}
            widthMax={payload['width-max']}
            weightMin={payload['weight-min']}
            weightMax={payload['weight-max']}
          />
        </Suspense>
      </div>
    </div>
  );
}
