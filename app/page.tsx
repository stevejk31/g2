import React, { Suspense } from 'react';
import Typography from '@mui/material/Typography';

import Loading from '@/app/ui/atoms/Loading';
import Yoyos from '@/app/ui/organisms/Yoyos';
import YoyoFilter from '@/app/ui/organisms/YoyoFilter';

export default async function Home() {
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
          <Yoyos className="xl:w-2/3" />
        </Suspense>
      </div>
    </div>
  );
}
